import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '../../schemas/upload.schema';
import * as s3 from '../../vendor/s3';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name)
    private uploadModel: Model<UploadDocument>,
    private s3: s3.S3Service,
  ) { }

  private async deleteUploads(templates: UploadDocument[]) {
    const srcSet = new Set<string>();
    const ids: string[] = [];

    for (const template of templates) {
      srcSet.add(template.src.substring(template.src.indexOf("user-upload")));
      ids.push(template._id);
    }

    await this.s3.dropImages({
      keys: Array.from(srcSet),
    });

    await this.uploadModel.deleteMany({
      _id: { $in: ids },
    });

    return true;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteRemovedUploads() {
    const dateOffset = 24 * 60 * 60 * 1000 * 30; // 30 days
    const monthAgo = new Date(new Date().getTime() - dateOffset);

    const uploads = await this.uploadModel.find({
      deletedAt: { $lte: monthAgo },
      deleted: true,
    });

    await this.deleteUploads(uploads);

    return true;
  }
}
