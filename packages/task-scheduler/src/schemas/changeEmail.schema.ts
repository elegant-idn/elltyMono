import {Document, Types} from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ChangeEmailDocument = ChangeEmail & Document;

@Schema({timestamps:true})
export class ChangeEmail{
    @Prop({
        unique: true
    })
    emailToken: string;

    @Prop({
        unique: true
    })
    email: string;

    @Prop({
        type: Types.ObjectId
    })
    userId: string;
}

export const ChangeEmailSchema = SchemaFactory.createForClass(ChangeEmail);