import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YooCheckout } from '@a2seven/yoo-checkout';
import {
  YookassaSubscriptionSchema,
  YookassaSubscription,
} from 'src/schemas/yookassa-subscription.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { PromoCode, PromoCodeSchema } from '../../schemas/promocode.schema';
import { YookassaPayController } from './yookassa-pay.controller';
import { YookassaPayService } from './yookassa-pay.service';
import { SendyService } from '../../utils/sendy.service';

@Module({
  controllers: [YookassaPayController],
  providers: [YookassaPayService],
  exports: [YookassaPayService],
})
export class YookassaPayModule {
  static forRoot(shopId: string, secretKey: string): DynamicModule {
    const yookassa = new YooCheckout({
      shopId,
      secretKey,
    });
    const yookassaPayProvider: Provider = {
      provide: 'YOOKASSA_CLIENT',
      useValue: yookassa,
    };

    return {
      module: YookassaPayModule,
      imports: [
        MongooseModule.forFeature([
          {
            name: YookassaSubscription.name,
            schema: YookassaSubscriptionSchema,
          },
          { name: User.name, schema: UserSchema },
          { name: PromoCode.name, schema: PromoCodeSchema },
        ]),
      ],
      providers: [yookassaPayProvider, SendyService],
      exports: [yookassaPayProvider],
      global: true,
    };
  }
}
