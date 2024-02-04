import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {generate} from "shortid";

export type PromoCodeDocument = PromoCode & Document;

export enum PromoStatus {
    Active="active",
    Inactive="inactive"
}

@Schema({timestamps:true})
export class PromoCode {
    @Prop({
        unique: true
    })
    code: string;

    @Prop({
        enum: PromoStatus
    })
    status:PromoStatus;

    @Prop()
    percent:number

    @Prop()
    stripe_id:string

    @Prop()
    parent_plans:string[]

    @Prop()
    plans:string[]
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);