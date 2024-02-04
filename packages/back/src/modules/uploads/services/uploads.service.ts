import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { configuration } from '../../../config/configuration';
import { Upload, UploadDocument } from '../../../schemas/upload.schema';
import { UserDocument } from '../../../schemas/user.schema';
import * as graphics from '../../../utils/graphics';
import {
  errHandler,
  pipeAsync,
  USER_UPLOAD_DEFAULT_DIR,
  USER_UPLOAD_PREVIEWS_DIR,
} from '../../../utils/helper';
import { readStream } from '../../../utils/localstorage';
import * as s3 from '../../../vendor/s3';
import { CreateDto } from '../dto/create.dto';
import { BulkDeleteDto } from '../dto/deleteBulk.dto';
import { GetDto } from '../dto/get.dto';
import { PatchDto } from '../dto/patch.dto';
import { getUserStorageMeta } from '../utils/getUserStorageMeta';
import { TrashPatchDto } from '../dto/trashPatch.dto';
import { SoftDeleteDocument } from 'mongoose-delete';

const ALLOWED_EXTENSIONS = configuration().allowedUploadsExtensions;

// 250 KB
const DESIRED_PREVIEW_SIZE = 1024 * 250;

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name)
    private readonly uploadModel: PaginateModel<UploadDocument> &
      SoftDeleteDocument,
  ) {}

  async getAll(dto: GetDto, user: UserDocument) {
    const uploads = await this.uploadModel.paginate(
      {
        user: user._id,
        src: { $exists: true },
        deleted: { $ne: true },
      },
      {
        sort: { createdAt: -1 },
        limit: dto.amount,
        page: dto.page,
      },
    );

    return {
      uploads: uploads.docs,
      ...uploads,
      docs: undefined,
    };
  }

  async getTrash(dto: GetDto, user: UserDocument) {
    const uploads = await this.uploadModel.paginate(
      {
        user: user._id,
        src: { $exists: true },
        deleted: { $eq: true },
      },
      {
        sort: { deletedAt: -1 },
        limit: dto.amount,
        page: dto.page,
      },
    );

    return {
      uploads: uploads.docs,
      ...uploads,
      docs: undefined,
    };
  }

  async create(
    dto: CreateDto,
    files: Express.Multer.File[],
    user: UserDocument,
  ) {
    const normalizedNames = Array.isArray(dto.names) ? dto.names : [dto.names];

    const uploadResults: (UploadDocument | null)[] = [];
    const { storageUsed: totalUploadSize, totalStorage: userLimit } =
      await getUserStorageMeta(this.uploadModel, user);

    const filesToUpload: Express.Multer.File[] = [];
    const originalFileIndexes: number[] = [];

    let currentStorageUsedWithFilesToUpload = totalUploadSize;
    let lastImage = false;
    files.forEach((file, index) => {
      const futureSize = currentStorageUsedWithFilesToUpload + file.size;

      const storageLimitExceeded = futureSize > userLimit;
      if (
        (storageLimitExceeded && lastImage) ||
        !ALLOWED_EXTENSIONS.includes(file.mimetype)
      ) {
        uploadResults[index] = null;
        return;
      }

      if (storageLimitExceeded) {
        lastImage = true;
      }

      currentStorageUsedWithFilesToUpload = futureSize;
      filesToUpload.push(file);
      originalFileIndexes.push(index);
    });

    await Promise.allSettled(
      filesToUpload.map(async (file, index) => {
        const { width, height } = await graphics
          .getMetaLocal(file.path)
          .catch(errHandler('metadata extract issue'));

        const fileName = normalizedNames[originalFileIndexes[index]];
        const nameSplit = fileName.split('.');
        const fileExtension = nameSplit.splice(nameSplit.length - 1, 1);

        const uploadDoc = await this.uploadModel.create({
          title: nameSplit.join('.'),
          width,
          height,
          user,
        });

        // try {
        // upload main file
        const targetLocation = {
          folder: USER_UPLOAD_DEFAULT_DIR(user, uploadDoc),
          key: `${uploadDoc.id}.${fileExtension}`,
          mimeType: file.mimetype,
        };

        const source = await readStream(file.path);

        const uploaded = await s3
          .push(source, targetLocation)
          .catch(errHandler('upload transfer issue'));

        const head = await s3.head({
          key: uploaded.Key,
        });

        uploadDoc.size = head.ContentLength;
        uploadDoc.src = uploaded.Location;
        uploadDoc.folderKey = targetLocation.folder;

        if (file.mimetype === 'image/svg+xml') {
          uploadDoc.preview = uploadDoc.src;
        } else {
          const resizeMultiplier = Math.max(
            Math.min(DESIRED_PREVIEW_SIZE / file.size, 0.7),
            0.1,
          );

          // create preview for the image
          const resize = await graphics.resizeStream(
            Math.floor(width * resizeMultiplier),
          );

          const targetPreviewLocation = {
            folder: USER_UPLOAD_PREVIEWS_DIR(user, uploadDoc),
            key: `${uploadDoc.id}.${fileExtension}`,
            mimeType: file.mimetype,
          };

          const { upload, dest } = s3.pushStream(targetPreviewLocation);

          const previewSource = await readStream(file.path);
          const [uploadedPreview] = await Promise.all([
            upload,
            pipeAsync(previewSource, resize, dest),
          ]).catch(errHandler('upload preview transfer issue'));

          uploadDoc.preview = uploadedPreview.Location;
        }

        await uploadDoc.save();

        uploadResults[originalFileIndexes[index]] = uploadDoc;
        // } catch (e) {
        //   uploadDoc.delete();
        //   uploadResults[originalFileIndexes[index]] = null;
        //   currentStorageUsedWithFilesToUpload -= file.size;

        //   throw e;
        // }
      }),
    );

    return {
      storageUsed: currentStorageUsedWithFilesToUpload,
      totalStorage: userLimit,
      result: uploadResults,
    };
  }

  async getUserStorageMeta(user: UserDocument) {
    const { storageUsed, totalStorage } = await getUserStorageMeta(
      this.uploadModel,
      user,
    );

    return {
      storageUsed,
      totalStorage,
    };
  }

  async deleteBulk(user: UserDocument, dto: BulkDeleteDto) {
    const uploadsToDelete = await this.uploadModel.find({
      user: user._id,
      _id: { $in: dto.ids },
    });

    const folders: string[] = [];
    const ids: string[] = [];

    uploadsToDelete.forEach((upload) => {
      folders.push(upload.folderKey);
      ids.push(upload._id);
    });

    await s3.dropManyRecursive({
      folders,
    });

    await this.uploadModel.deleteMany({
      _id: { $in: ids },
    });

    const { storageUsed, totalStorage } = await getUserStorageMeta(
      this.uploadModel,
      user,
    );

    return { storageUsed, totalStorage };
  }

  async moveToTrash(user: UserDocument, dto: TrashPatchDto) {
    await this.uploadModel.delete({
      user: user._id,
      _id: { $in: dto.ids },
    } as any);

    const { storageUsed, totalStorage } = await getUserStorageMeta(
      this.uploadModel,
      user,
    );

    return { storageUsed, totalStorage };
  }

  async restore(user: UserDocument, dto: TrashPatchDto) {
    const currentStorage = await getUserStorageMeta(this.uploadModel, user);

    const uploadsToRestore = await this.uploadModel.find({
      user: user._id,
      _id: { $in: dto.ids },
    } as any);

    const newTotalUploadsSize = uploadsToRestore.reduce(
      (acc, upload) => acc + upload.size,
      currentStorage.storageUsed,
    );

    if (newTotalUploadsSize > currentStorage.totalStorage) {
      return new HttpException('Store limit exceeded', HttpStatus.BAD_REQUEST);
    }

    await this.uploadModel.restore({
      user: user._id,
      _id: { $in: dto.ids },
    } as any);

    const { storageUsed, totalStorage } = await getUserStorageMeta(
      this.uploadModel,
      user,
    );

    return { storageUsed, totalStorage };
  }

  async patch(id: string, user: UserDocument, dto: PatchDto) {
    await this.uploadModel.updateOne(
      {
        _id: id,
        user: user._id,
      },
      {
        title: dto.title,
      },
    );
  }
}
