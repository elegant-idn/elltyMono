
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { generate } from "shortid";

export type ColorDocument = Color & Document;

@Schema({timestamps:true})
export class Color {
    @Prop({
        unique:true,
        required: true
    })
    value: string;

    @Prop()
    hex: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);