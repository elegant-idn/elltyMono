import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { generate } from 'shortid';
import { Document, Types } from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import * as mongooseDelete from 'mongoose-delete';

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
    autopopulate: { select: '_id value' },
  })
  categories: Category;

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
UserTemplateSchema.plugin(mongoosePaginate);
UserTemplateSchema.plugin(mongooseDelete, {
  deletedAt: true,
});
