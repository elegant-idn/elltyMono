import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { MailchimpService } from 'src/utils/mailchimp.service';
import { configuration } from '../../config/configuration';
import {
  ChangeEmail,
  ChangeEmailSchema,
} from '../../schemas/changeEmail.schema';
import { Payment, PaymentSchema } from '../../schemas/payment.schema';
import { Template, TemplateSchema } from '../../schemas/template.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import {
  YookassaSubscription,
  YookassaSubscriptionSchema,
} from '../../schemas/yookassa-subscription.schema';
import { jwtConstants } from '../auth/constants';
import { FoldersModule } from '../folders/folders.module';
import { MailModule } from '../mail/mail.module';
import { PaypalPayModule } from '../paypal-pay/paypal-pay.module';
import { StripePayModule } from '../stripe-pay/stripe-pay.module';
import { UserCronService } from './services/user.cron.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { YookassaPayModule } from '../yookassa-pay/yookassa-pay.module';
import { SendyService } from '../../utils/sendy.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ChangeEmail.name, schema: ChangeEmailSchema },
      { name: Template.name, schema: TemplateSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: YookassaSubscription.name, schema: YookassaSubscriptionSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRETKEY || jwtConstants.secret,
      signOptions: {
        expiresIn: process.env.EXPIRESIN || '30d',
      },
    }),
    MailModule,
    FoldersModule,
    StripePayModule,
    PaypalPayModule.forRoot(
      configuration().paypal.environment,
      configuration().paypal.clientId,
      configuration().paypal.clientSecret,
    ),
    YookassaPayModule.forRoot(
      configuration().yookassa.shopId,
      configuration().yookassa.secretKey,
    ),
    ScheduleModule.forRoot(),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserCronService, MailchimpService, SendyService],
})
export class UserModule {}
