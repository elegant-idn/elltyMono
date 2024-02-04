import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PaypalPayService } from './services/paypal-pay.service';
import { PaypalPayController } from './paypal-pay.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../../schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { ConfigModule } from '@nestjs/config';
import { configuration } from '../../config/configuration';
import { PromoCode, PromoCodeSchema } from '../../schemas/promocode.schema';
import { SendyService } from '../../utils/sendy.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paypal = require('paypal-rest-sdk');

@Module({
  controllers: [PaypalPayController],
  providers: [PaypalPayService],
  exports: [PaypalPayService],
})
export class PaypalPayModule {
  static forRoot(
    mode: string,
    client_id: string,
    client_secret: string,
  ): DynamicModule {
    paypal.configure({
      mode: mode,
      client_id: client_id,
      client_secret: client_secret,
    });

    const paypalProvider: Provider = {
      provide: 'PAYPAL_CLIENT',
      useValue: paypal,
    };

    return {
      module: PaypalPayModule,
      imports: [
        MongooseModule.forFeature([
          { name: Payment.name, schema: PaymentSchema },
          { name: User.name, schema: UserSchema },
          { name: PromoCode.name, schema: PromoCodeSchema },
        ]),
        JwtModule.register({
          secret: process.env.SECRETKEY || jwtConstants.secret,
          signOptions: {
            expiresIn: process.env.EXPIRESIN || '30d',
          },
        }),
      ],
      providers: [paypalProvider, SendyService],
      exports: [paypalProvider],
      global: true,
    };
  }
}
