import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload, UploadSchema } from '../../schemas/upload.schema';
import { S3Module } from '../../vendor/s3';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [],
  providers: [UploadsService],
  exports: [UploadsService],
  imports: [
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
    S3Module,
  ],
})
export class UploadsModule {}
