import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Color } from './color.schema';
import { Tag } from './tag.schema';
import { Category } from './category.schema';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from './user.schema';
const autoPopulate = require('mongoose-autopopulate');

export enum templateStatus {
  free = 'free',
  pro = 'pro',
}

export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template {
  @Prop()
  data: string;

  @Prop()
  preview: string[];

  @Prop({
    type: String,
    index: true,
  })
  title: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Category',
    autopopulate: { select: '_id value' },
  })
  categories: Category[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Color',
    autopopulate: { select: '_id value hex' },
  })
  colors: Color[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Tag',
    autopopulate: { select: '_id value' },
  })
  tags: Tag[];

  @Prop({
    type: String,
    enum: templateStatus,
    default: templateStatus.free,
  })
  status: templateStatus;
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop()
  width: string;

  @Prop()
  height: string;

  @Prop()
  languages: string[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
TemplateSchema.plugin(mongoosePaginate);
TemplateSchema.plugin(autoPopulate);
