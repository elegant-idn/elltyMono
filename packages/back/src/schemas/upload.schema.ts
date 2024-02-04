import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import * as MongooseDelete from 'mongoose-delete';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true })
export class Upload {
  @Prop()
  title: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  user: User;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  size: number;

  @Prop()
  preview: string;

  @Prop()
  src: string;

  @Prop()
  folderKey: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);

UploadSchema.plugin(MongooseDelete, {
  deletedAt: true,
});
