import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type YookassaSubscriptionDocument = YookassaSubscription & Document;

@Schema()
export class YookassaSubscription {
  @Prop({ unique: true })
  userId: string;
  @Prop({
    enum: ['monthly', 'yearly'],
  })
  plan: string;
  @Prop({})
  paymentDue: Date;
  @Prop({})
  price: string;
  @Prop({ unique: true })
  paymentMethodId: string;
  @Prop({
    enum: ['active', 'will-cancel', 'canceled', 'pending'],
  })
  status: string;

  @Prop({
    type: String,
    unique: true,
  })
  email: string;
}

export const YookassaSubscriptionSchema =
  SchemaFactory.createForClass(YookassaSubscription);
