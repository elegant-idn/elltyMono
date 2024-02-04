import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Color} from "./color.schema";
import {Tag} from "./tag.schema";
import {Category} from "./category.schema";
import {Document, Types, Schema as MongooseSchema} from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import {User} from "./user.schema";
const autoPopulate = require("mongoose-autopopulate")

export enum elementStatus {
    free = "free",
    pro = "pro"
}

export type ElementDocument = Element & Document;

@Schema({timestamps: true})
export class Element {
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
        autopopulate: {select: "_id value"}
    })
    categories: Category[];

    @Prop({
        type: [Types.ObjectId],
        ref: 'Color',
        autopopulate: {select: "_id value"}
    })
    colors: Color[];

    @Prop({
        type: [Types.ObjectId],
        ref: 'Tag',
        autopopulate: {select: "_id value"}
    })
    tags: Tag[];

    @Prop({
        type: String,
        enum: elementStatus,
        default: elementStatus.free,
    })
    status: elementStatus;

    @Prop({
        type:Types.ObjectId,
        ref:'User',
    })
    user:User
}


export const ElementSchema = SchemaFactory.createForClass(Element);
ElementSchema.plugin(mongoosePaginate);
ElementSchema.plugin(autoPopulate);
