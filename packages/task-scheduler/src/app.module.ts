import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { YookassaSubscriptionModule } from './modules/yookassa-subsciption/yookassa-subsciption.module';
import { UserModule } from './modules/user/user.module';
import { UserTemplatesModule } from './modules/user-templates/user-templates.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UploadsModule } from './modules/uploads/uploads.module';

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
    YookassaSubscriptionModule.forRoot(
      configuration().yookassa.shopId,
      configuration().yookassa.secretKey,
    ),
    UserModule,
    ScheduleModule.forRoot(),
    UserTemplatesModule,
    SubscriptionModule,
    UploadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
