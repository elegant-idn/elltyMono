import { Module } from '@nestjs/common';
import { StripePayService } from './services/stripe-pay.service';
import { StripePayController } from './stripe-pay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { PromocodesModule } from '../promocodes/promocodes.module';
import { PromoCode, PromoCodeSchema } from '../../schemas/promocode.schema';
import { SendyService } from '../../utils/sendy.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: PromoCode.name, schema: PromoCodeSchema },
    ]),
    PromocodesModule,
  ],
  exports: [StripePayService],
  controllers: [StripePayController],
  providers: [StripePayService, SendyService],
})
export class StripePayModule {}
