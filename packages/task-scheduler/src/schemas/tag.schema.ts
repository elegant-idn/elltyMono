import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {generate} from "shortid";

export type TagDocument = Tag & Document;

@Schema({timestamps:true})
export class Tag {
    // @Prop({
    //     default: generate,
    //     index: true,
    //     type: String,
    //     unique: true,
    // })
    // uuid: string;
    @Prop({
        unique: true
    })
    value: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);