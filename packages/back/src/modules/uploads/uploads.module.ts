import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MulterModule } from '@nestjs/platform-express';
import { Upload, UploadSchema } from '../../schemas/upload.schema';
import { UploadsService } from './services/uploads.service';
import { UploadsController } from './uploads.controller';

const mongoosePaginate = require('mongoose-paginate-v2');

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Upload.name,
        useFactory: () => {
          const schema = UploadSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
    MulterModule.register({
      dest: '../static/static/uploads/',
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
