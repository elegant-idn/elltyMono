import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { PaginateModel, Types } from 'mongoose';
import * as zlib from 'zlib';
import {
  DesignerTemplate,
  DesignerTemplateDocument,
} from '../../../schemas/designerTemplates.schema';
import { UserDocument } from '../../../schemas/user.schema';
import {
  UserTemplate,
  UserTemplateDocument,
} from '../../../schemas/userTemplates.schema';
import { PaginateDto } from '../../../shared/paginate.dto';
import * as graphics from '../../../utils/graphics';
import {
  USER_TEMPLATE_DEFAULT_DIR,
  USER_TEMPLATE_PREVIEWS_DIR,
  USER_TEMPLATE_REFACTOR,
  errHandler,
  pipeAsync,
} from '../../../utils/helper';
import { readStream } from '../../../utils/localstorage';
import { FoldersService } from '../../folders/services/folders.service';

import { SoftDeleteDocument } from 'mongoose-delete';
import * as s3 from '../../../vendor/s3';
@Injectable()
export class UserTemplatesService {
  constructor(
    @InjectModel(UserTemplate.name)
    private readonly userTemplateModel: PaginateModel<UserTemplateDocument> &
      SoftDeleteDocument,
    @InjectModel(DesignerTemplate.name)
    private readonly designerTemplateModel: PaginateModel<DesignerTemplateDocument>,
    private foldersService: FoldersService,
  ) { }

  async createUserTemplate(
    user: UserDocument | undefined,
    template: Express.Multer.File,
    title: string,
    temporaryUserToken?: string,
    categoryId?: string,
    height?: number,
    width?: number,
  ) {
    const userUuid = user?.uuid ?? temporaryUserToken;
    const source = await readStream(template.path);

    if (!source) {
      throw new HttpException(
        'Template file does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const targetLocation = {
      folder: `user-templates/user-${userUuid}-templates`,
      key: template.filename + '.gz',
    };

    const { upload, dest } = s3.pushStream(targetLocation);
    const zip = zlib.createGzip();

    const [uploaded] = await Promise.all([
      upload,
      pipeAsync(source, zip, dest),
    ]).catch(errHandler('template transfer issue'));

    const userTemplate = await this.userTemplateModel.create({
      user: user,
      path: uploaded.Location,
      title: title,
      version: 0,
      filename: targetLocation.key,
      destination: targetLocation.folder,
      temporaryUserToken,
      categories: categoryId,
      height,
      width,
    });

    return {
      _id: userTemplate._id,
      name: userTemplate.filename,
      version: userTemplate.version,
      title: userTemplate.title,
    };
  }

  async cloneUserTemplate(
    templateId: string,
    user: UserDocument,
    title: string,
  ) {
    const templateToCopy = await this.userTemplateModel.findOne({
      _id: templateId,
      user: user._id,
    });

    const copyKey = `${templateToCopy.filename.split('-')[0]}-${Date.now()}`;
    const copyFilename = `${copyKey}.json.gz`;
    const copyPreviewName = `${copyKey}.jpg`;

    const templateCopyResult = await s3.copy(
      {
        fromFolder: templateToCopy.destination,
        fromKey: templateToCopy.filename,
        toFolder: templateToCopy.destination,
      },
      copyFilename,
      true,
    );

    const previewFromKey = templateToCopy.filename.split('.')[0] + '.jpg';

    const previewToFolder = USER_TEMPLATE_PREVIEWS_DIR(user);
    const previewFromFolder = USER_TEMPLATE_PREVIEWS_DIR(user);
    // copy preview to user folder
    const previewCopyResult = await s3.copy(
      {
        fromFolder: previewFromFolder,
        fromKey: previewFromKey,
        toFolder: previewToFolder,
      },
      copyPreviewName,
      true,
    );

    const clonedTemplate = await this.userTemplateModel.create({
      title,
      version: 0,
      filename: copyFilename,
      // update template path, destination
      path: templateCopyResult.Location,
      destination: templateToCopy.destination,
      // update preview path, destination
      preview: previewCopyResult.Location,
      preview_key: [previewToFolder, copyPreviewName].join('/'),
      // remove temp token, set user
      user: user._id,
      width: templateToCopy.width,
      height: templateToCopy.height,
      categories: templateToCopy.categories,
    });

    return await clonedTemplate.populate('categories');
  }

  async getUserTemplate(templateId: string, user: UserDocument, res: Response) {
    const userTemplate = await this.userTemplateModel
      .findOne({ _id: templateId, user: user._id })
      .exec();

    const opts = {
      key: userTemplate.filename,
      folder: userTemplate.destination,
    };

    await s3
      .head(opts)
      .catch(errHandler('Template file does not exist', HttpStatus.NOT_FOUND));

    const source = s3.pullStream(opts);
    await pipeAsync(
      source,
      res.set('Content-Type', 'text/plain').set('Content-Encoding', 'gzip'),
    ).catch(errHandler('template transfer issue'));
  }

  async getNonUserTemplate(templateId: string, user: string, res: Response) {
    const userTemplate = await this.userTemplateModel
      .findOne({ _id: templateId, temporaryUserToken: user })
      .exec();

    if (!userTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const opts = {
      key: userTemplate.filename,
      folder: userTemplate.destination,
    };

    await s3
      .head(opts)
      .catch(errHandler('Template file does not exist', HttpStatus.NOT_FOUND));

    const source = s3.pullStream(opts);
    await pipeAsync(
      source,
      res.set('Content-Type', 'text/plain').set('Content-Encoding', 'gzip'),
    ).catch(errHandler('template transfer issue'));
  }

  async sendVerification(templateId: string, user: UserDocument) {
    const uTemplate = await this.userTemplateModel
      .findOne({ _id: templateId, user: user._id })
      .exec();
    if (!uTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.designerTemplateModel
      .findOneAndUpdate(
        { userTemplate: uTemplate._id, user: user._id },
        { $set: { userTemplate: uTemplate._id, user: user._id } },
        { upsert: true },
      )
      .exec();
  }

  async updateUserTemplate(
    user: UserDocument | undefined,
    templateId: string,
    version: number,
    template: Express.Multer.File,
    temporaryUserToken?: string,
    height?: number,
    width?: number,
  ) {
    const userTemplate = await this.userTemplateModel
      .findOne({
        _id: templateId,
        $or: [{ user: user?._id }, { temporaryUserToken }],
      })
      .exec();

    if (!userTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    const source = await readStream(template.path);

    if (!source) {
      throw new HttpException(
        'Template file does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const targetLocation = {
      folder: USER_TEMPLATE_DEFAULT_DIR(user, userTemplate.temporaryUserToken),
      key: userTemplate.filename,
    };

    const { upload, dest } = s3.pushStream(targetLocation);
    const zip = zlib.createGzip();

    const [uploaded] = await Promise.all([
      upload,
      pipeAsync(source, zip, dest),
    ]).catch(errHandler('template transfer issue'));

    await this.userTemplateModel
      .updateOne(
        { _id: templateId },
        {
          version: version,
          height: height ?? userTemplate.height,
          width: width ?? userTemplate.width,
          updatedAt: new Date(),
        },
      )
      .exec();
  }

  async updateUserTemplateTitle(
    user: UserDocument,
    templateId: string,
    title: string,
  ) {
    const userTemplate = await this.userTemplateModel
      .findOne({ _id: templateId, user: user._id })
      .exec();

    if (!userTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userTemplateModel
      .updateOne(
        { _id: templateId, user: user._id },
        {
          title,
        },
      )
      .exec();
  }

  async updateUserTemplatePreview(
    user: UserDocument | undefined,
    templateId: string,
    preview: Express.Multer.File,
    temporaryUserToken?: string,
  ) {
    const userTemplate = await this.userTemplateModel
      .findOne({
        _id: templateId,
        $or: [{ user: user?._id }, { temporaryUserToken }],
      })
      .exec();

    if (!userTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!preview.mimetype.includes('image')) {
      throw new HttpException('file must be image', HttpStatus.BAD_REQUEST);
    }

    const source = await readStream(preview.path);

    if (!source) {
      throw new HttpException(
        'Template file does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const { width } = await graphics
      .getMetaLocal(preview.path)
      .catch(errHandler('metadata extract issue'));

    const resize = await graphics.resizeStream(Math.floor(width * 0.7), 'jpg');

    const targetLocation = {
      folder: USER_TEMPLATE_PREVIEWS_DIR(user, temporaryUserToken),
      key: userTemplate.filename.split('.')[0] + '.jpg',
      mimeType: 'image/jpeg',
    };

    const { upload, dest } = s3.pushStream(targetLocation);

    const [uploaded] = await Promise.all([
      upload,
      pipeAsync(source, resize, dest),
    ]).catch(errHandler('template transfer issue'));

    await this.userTemplateModel
      .updateOne(
        { _id: templateId },
        {
          preview: uploaded.Location,
          preview_key: [targetLocation.folder, targetLocation.key].join('/'),
        },
      )
      .exec();
  }

  async findAll(user: UserDocument, paginate: PaginateDto) {
    return await this.userTemplateModel.paginate(
      { user: user._id, deleted: { $ne: true } },
      {
        sort: { updatedAt: -1 },
        limit: paginate.amount,
        page: paginate.offset,
        populate: 'categories',
      },
    );
  }

  async findTrash(user: UserDocument, paginate: PaginateDto) {
    return await this.userTemplateModel.paginate(
      { user: user._id, deleted: { $eq: true } },
      {
        sort: { deletedAt: -1 },
        limit: paginate.amount,
        page: paginate.offset,
        populate: 'categories',
      },
    );
  }

  async getUserTemplateMeta(templateId: string, user: UserDocument) {
    return await this.userTemplateModel
      .findOne({
        _id: templateId,
        user: user._id,
      })
      .select('version title');
  }

  async getNonUserTemplateMeta(templateId: string, user: string) {
    return await this.userTemplateModel
      .findOne({
        _id: templateId,
        temporaryUserToken: user,
      })
      .select('version title');
  }

  async findByFolder(id: string, user: UserDocument, paginate: PaginateDto) {
    return await this.userTemplateModel.paginate(
      { user: user._id, folder: new Types.ObjectId(id) },
      {
        sort: { createdAt: -1 },
        limit: paginate.amount,
        page: paginate.offset,
      },
    );
  }

  async toTrash(ids: string | string[], user: UserDocument) {
    await this.userTemplateModel.delete({
      _id: { $in: ids },
      user: user._id,
    } as any);
  }

  async restore(ids: string | string[], user: UserDocument) {
    await this.userTemplateModel.restore({
      _id: { $in: ids },
      user: user._id,
    } as any);
  }

  async refactorTemplateFolder(id: string, folder: string, user: UserDocument) {
    const userTemplate = await this.userTemplateModel
      .findOne({ _id: id, user: user._id })
      .exec();

    if (!userTemplate) {
      throw new HttpException(
        'Template does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await s3
      .move({
        fromKey: userTemplate.filename,
        fromFolder: userTemplate.destination,
        toFolder: USER_TEMPLATE_REFACTOR(user, folder),
      })
      .catch(errHandler('template transfer issue'));

    await this.userTemplateModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            path: result.Location,
            destination: USER_TEMPLATE_REFACTOR(user, folder),
          },
        },
      )
      .exec();
  }

  async deleteAllByUser(user: UserDocument) {
    await s3
      .dropRecursive({
        folder: USER_TEMPLATE_DEFAULT_DIR(user),
      })
      .catch((e) => console.error);

    await this.userTemplateModel.deleteMany({
      user: user._id,
    });
  }

  async remove(id: string, user: UserDocument) {
    const template = await this.userTemplateModel
      .findOne({ _id: id, user: user._id })
      .exec();

    await s3
      .drop({
        key: template.filename,
        folder: USER_TEMPLATE_DEFAULT_DIR(user),
      })
      .catch((e) => console.error);

    await s3
      .drop({
        key: template.preview_key,
        folder: USER_TEMPLATE_PREVIEWS_DIR(user),
      })
      .catch((e) => console.error);

    return await this.userTemplateModel.deleteOne({ _id: id }).exec();
  }

  async assignTemplatesToUserByTemporaryToken(
    temporaryUserToken: string,
    user: UserDocument,
  ) {
    const templatesToUpdate = await this.userTemplateModel.find({
      temporaryUserToken,
    });

    const templateToFolder = USER_TEMPLATE_DEFAULT_DIR(user);
    const previewToFolder = USER_TEMPLATE_PREVIEWS_DIR(user);
    const previewFromFolder = USER_TEMPLATE_PREVIEWS_DIR(
      undefined,
      temporaryUserToken,
    );

    for (const userTemplate of templatesToUpdate) {
      // move template to user folder
      const templateMoveResult = await s3.move({
        fromFolder: userTemplate.destination,
        fromKey: userTemplate.filename,
        toFolder: templateToFolder,
      });

      const previewFromKey = userTemplate.filename.split('.')[0] + '.jpg';

      // move preview to user folder
      const previewMoveResult = await s3.move({
        fromFolder: previewFromFolder,
        fromKey: previewFromKey,
        toFolder: previewToFolder,
      });

      await this.userTemplateModel.updateOne(
        {
          _id: userTemplate._id,
        },
        {
          // update template path, destination
          path: templateMoveResult.Location,
          destination: templateToFolder,
          // update preview path, destination
          preview: previewMoveResult.Location,
          preview_key: [previewToFolder, previewFromKey].join('/'),
          // remove temp token, set user
          user: user._id,
          $unset: { temporaryUserToken: '' },
        },
      );
    }
  }
}
