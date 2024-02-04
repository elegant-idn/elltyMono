import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { YooCheckout } from '@a2seven/yoo-checkout';
import {
  YookassaSubscriptionSchema,
  YookassaSubscription,
} from 'src/schemas/yookassa-subscription.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { YookassaSubsciptionService } from './yookassa-subsciption.service';
import { MailModule } from '../mail/mail.module';
import { SendyService } from '../../utils/sendy.service';

@Module({
  controllers: [],
  providers: [YookassaSubsciptionService],
  exports: [YookassaSubsciptionService],
})
export class YookassaSubscriptionModule {
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
      module: YookassaSubscriptionModule,
      imports: [
        MongooseModule.forFeature([
          {
            name: YookassaSubscription.name,
            schema: YookassaSubscriptionSchema,
          },
          { name: User.name, schema: UserSchema },
        ]),
        MailModule,
      ],
      providers: [yookassaPayProvider, SendyService],
      exports: [yookassaPayProvider],
      global: true,
    };
  }
}
