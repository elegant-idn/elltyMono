import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplatesController } from './templates.controller';
import { AuthModule } from '../auth/auth.module';
import { TemplatesService } from './services/templates.service';
import { PassportModule } from '@nestjs/passport';

import { Template, TemplateSchema } from '../../schemas/template.schema';
import { MulterModule } from '@nestjs/platform-express';
import {
  UserTemplate,
  UserTemplateSchema,
} from '../../schemas/userTemplates.schema';
import { Color, ColorSchema } from '../../schemas/color.schema';
import { Tag, TagSchema } from '../../schemas/tag.schema';
import { Category, CategorySchema } from '../../schemas/category.schema';
const mongoosePaginate = require('mongoose-paginate-v2');

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Template.name,
        useFactory: () => {
          const schema = TemplateSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
      {
        name: UserTemplate.name,
        useFactory: () => {
          const schema = UserTemplateSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
      {
        name: Color.name,
        useFactory: () => {
          const schema = ColorSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
      {
        name: Tag.name,
        useFactory: () => {
          const schema = TagSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ]),
    MulterModule.register({
      dest: '../static/static/templates/',
    }),
    AuthModule,
    PassportModule,
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
