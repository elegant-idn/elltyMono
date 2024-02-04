import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { FacebookStrategy } from './strategy/facebook.strategy';
import { configuration } from '../../config/configuration';
import { AppleStrategy } from './strategy/apple.strategy';
import { MailchimpService } from '../../utils/mailchimp.service';
import { SendyService } from 'src/utils/sendy.service';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import {
  YookassaSubscription,
  YookassaSubscriptionSchema,
} from '../../schemas/yookassa-subscription.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from '../../schemas/token.schema';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY || jwtConstants.secret,
      signOptions: {
        expiresIn: configuration().expiresIn || '30d',
      },
    }),
    MailModule,
    UserTemplatesModule,
    MongooseModule.forFeature([
      {
        name: YookassaSubscription.name,
        schema: YookassaSubscriptionSchema,
      },
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
    MailchimpService,
    SendyService,
  ],
  exports: [
    AuthService,
    JwtModule,
    PassportModule,
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
  ],
})
export class AuthModule {}
