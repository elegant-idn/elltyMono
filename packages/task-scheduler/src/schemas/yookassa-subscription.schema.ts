import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type YookassaSubscriptionDocument = YookassaSubscription & Document;

@Schema({
  toObject: {
    virtuals: true,
  },
})
export class YookassaSubscription {
  user: User;

  @Prop({ unique: true })
  userId: string;
  @Prop({
    enum: ['monthly', 'yearly'],
  })
  plan: 'monthly' | 'yearly';
  @Prop({})
  paymentDue: Date;
  @Prop({})
  price: string;
  @Prop({ unique: true })
  paymentMethodId: string;
  @Prop({
    enum: ['pending', 'active', 'canceled'],
  })
  status: string;

  @Prop({
    type: String,
    unique: true,
  })
  email: string;
}

const YookassaSubscriptionSchema =
  SchemaFactory.createForClass(YookassaSubscription);

YookassaSubscriptionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

export { YookassaSubscriptionSchema };
