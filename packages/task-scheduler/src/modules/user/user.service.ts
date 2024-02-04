import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  DEFAULT_DOWNLOADS_COUNTER,
  User,
  UserDocument,
} from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetDownloadsCounter() {
    await this.userModel.updateMany(
      {},
      {
        downloadsCounter: DEFAULT_DOWNLOADS_COUNTER,
      },
    );
  }
}
