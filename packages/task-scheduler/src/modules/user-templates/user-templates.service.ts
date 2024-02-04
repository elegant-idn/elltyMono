import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  UserTemplate,
  UserTemplateDocument,
} from '../../schemas/userTemplates.schema';
import * as s3 from '../../vendor/s3';
import { SoftDeleteDocument } from 'mongoose-delete';

@Injectable()
export class UserTemplatesService {
  constructor(
    @InjectModel(UserTemplate.name)
    private userTemplateModel: Model<UserTemplateDocument> & SoftDeleteDocument,
    private s3: s3.S3Service,
  ) { }

  private async deleteTemplates(templates: UserTemplateDocument[]) {
    const foldersSet = new Set<string>();
    const ids: string[] = [];

    for (const template of templates) {
      foldersSet.add(template.destination);
      ids.push(template._id);
    }

    await this.s3.dropManyRecursive({
      folders: Array.from(foldersSet),
    });

    await this.userTemplateModel.deleteMany({
      _id: { $in: ids },
    });

    return true;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteUnusedUserTemplates() {
    const dateOffset = 24 * 60 * 60 * 1000; // 24 hours
    const yesterday = new Date(new Date().getTime() - dateOffset);

    const templates = await this.userTemplateModel.find({
      $or: [
        {
          user: { $exists: false },
        },
        {
          user: false,
        },
      ],
      temporaryUserToken: { $exists: true },
      createdAt: { $lte: yesterday },
    });

    await this.deleteTemplates(templates);

    return true;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async deleteRemovedUserTemplates() {
    const dateOffset = 24 * 60 * 60 * 1000 * 30; // 30 days
    const monthAgo = new Date(new Date().getTime() - dateOffset);

    const templates = await this.userTemplateModel.find({
      deletedAt: { $lte: monthAgo },
      deleted: true,
    });

    await this.deleteTemplates(templates);

    return true;
  }
}
