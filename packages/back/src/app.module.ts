import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';

import { ConfigModule } from '@nestjs/config';
import { StripeModule } from 'nestjs-stripe';
import { configuration } from './config/configuration';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ColorsModule } from './modules/colors/colors.module';
import { DesignerTemplatesModule } from './modules/designer-templates/designer-templates.module';
import { ElementsModule } from './modules/elements/elements.module';
import { FoldersModule } from './modules/folders/folders.module';
import { MailModule } from './modules/mail/mail.module';
import { PaypalPayModule } from './modules/paypal-pay/paypal-pay.module';
import { PromocodesModule } from './modules/promocodes/promocodes.module';
import { StripePayModule } from './modules/stripe-pay/stripe-pay.module';
import { TagsModule } from './modules/tags/tags.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UserTemplatesModule } from './modules/user-templates/user-templates.module';
import { UserModule } from './modules/user/user.module';
import { YookassaPayModule } from './modules/yookassa-pay/yookassa-pay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/.env.${process.env.APP_ENV}`,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        if (configuration().NODE_ENV == 'development') {
          const options: MongooseModuleOptions = {
            uri: configuration().DB_URI,
          };
          return options;
        } else if (configuration().NODE_ENV == 'production') {
          const options: MongooseModuleOptions = {
            uri: configuration().DB_URI,
            ssl: true,
            sslKey: 'X509-cert.pem',
            sslCert: 'X509-cert.pem',
          };
          return options;
        }
      },
    }),
    AuthModule,
    UserModule,
    MailModule,
    TemplatesModule,
    ElementsModule,
    DesignerTemplatesModule,
    UserTemplatesModule,
    TagsModule,
    ColorsModule,
    CategoriesModule,
    FoldersModule,
    PromocodesModule,
    UploadsModule,
    AdminModule,
    StripeModule.forRoot({
      apiKey: configuration().stripe.secret_key,
      apiVersion: '2020-08-27' as any,
    }),
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
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: 'stripe-pay/webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}
