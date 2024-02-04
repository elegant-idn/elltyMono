import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserTemplate,
  UserTemplateSchema,
} from '../../schemas/userTemplates.schema';
import { S3Module } from '../../vendor/s3';
import { UserTemplatesService } from './user-templates.service';

@Module({
  controllers: [],
  providers: [UserTemplatesService],
  exports: [UserTemplatesService],
  imports: [
    MongooseModule.forFeature([
      { name: UserTemplate.name, schema: UserTemplateSchema },
    ]),
    S3Module,
  ],
})
export class UserTemplatesModule {}
