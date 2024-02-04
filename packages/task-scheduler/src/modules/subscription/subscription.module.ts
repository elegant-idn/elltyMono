import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  YookassaSubscription,
  YookassaSubscriptionSchema,
} from '../../schemas/yookassa-subscription.schema';
import { MailModule } from '../mail/mail.module';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
@Module({
  controllers: [],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
  imports: [
    MongooseModule.forFeature([
      { name: YookassaSubscription.name, schema: YookassaSubscriptionSchema },
    ]),
    MailModule,
  ],
})
export class SubscriptionModule {}
