import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generate } from 'shortid';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({
    default: generate,
    index: true,
    type: String,
    unique: true,
  })
  uuid: string;
  @Prop({
    unique: false,
  })
  subId: string;
  @Prop({})
  paymentType: string;
  @Prop({ unique: true, isRequired: false })
  baToken: string;
  @Prop({})
  userId: string;
  @Prop({})
  customerId: string;
  @Prop({})
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
