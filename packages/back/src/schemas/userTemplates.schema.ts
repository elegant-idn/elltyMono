import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as MongooseDelete from 'mongoose-delete';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { generate } from 'shortid';
import { Category } from './category.schema';
import { User } from './user.schema';

export type UserTemplateDocument = UserTemplate & Document;

export enum UserTemplateStatus {
  active = 'active',
  deleted = 'deleted',
}

@Schema({ timestamps: true })
export class UserTemplate {
  @Prop({
    default: generate,
    index: true,
    unique: true,
  })
  id: string;

  @Prop()
  preview_key: string;

  @Prop()
  preview: string[];

  @Prop({
    type: Number,
    default: 1,
  })
  version: number;

  @Prop({
    type: String,
    index: true,
  })
  title: string;

  @Prop()
  schemaId: string;

  @Prop()
  path: string;

  @Prop()
  destination: string;

  @Prop()
  filename: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
  })
  categories: Category;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop({
    default: UserTemplateStatus.active,
    type: String,
  })
  status: UserTemplateStatus;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    autopopulate: { select: '_id name email' },
  })
  user: User;

  @Prop({
    type: String,
    index: true,
  })
  temporaryUserToken?: string;
}
export const UserTemplateSchema = SchemaFactory.createForClass(UserTemplate);

UserTemplateSchema.index({ user: 1, createdAt: -1 });

UserTemplateSchema.plugin(mongoosePaginate);

UserTemplateSchema.plugin(MongooseDelete, {
  deletedAt: true,
});
