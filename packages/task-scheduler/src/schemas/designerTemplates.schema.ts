import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {generate} from "shortid";
import {UserDocument} from "./user.schema";
import * as mongoosePaginate from "mongoose-paginate-v2";
const autoPopulate = require("mongoose-autopopulate")
import {UserTemplate, UserTemplateDocument} from "./userTemplates.schema";

export type DesignerTemplateDocument = DesignerTemplate &Document ;

export enum DesignerTemplateStatus {
    Accepted = 'accepted',
    Rejected = 'rejected',
    Pending = 'pending'
}

@Schema({timestamps:true})
export class DesignerTemplate{
    @Prop({
        default: generate,
        index: true,
        unique: true,
    })
    id: string;

    @Prop({
        type: Types.ObjectId,
        ref: 'UserTemplate',
        autopopulate: {select:"_id preview preview_key path title"}
    })
    userTemplate:UserTemplateDocument

    @Prop({type:String})
    title:string;

    @Prop({type:String})
    description:string;

    @Prop({
        default: DesignerTemplateStatus.Pending,
        type: String,
    })
    status: DesignerTemplateStatus;

    @Prop({
        type: Types.ObjectId,
        ref: 'User',
        autopopulate: {select:"_id firstName lastName email uuid"}
    })
    user: UserDocument;
}
export const DesignerTemplateSchema = SchemaFactory.createForClass(DesignerTemplate);
DesignerTemplateSchema.plugin(mongoosePaginate);
DesignerTemplateSchema.plugin(autoPopulate)
