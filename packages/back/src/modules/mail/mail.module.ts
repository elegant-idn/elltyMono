import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { join } from 'path';
import { configuration } from '../../config/configuration';
import { MultilingualSubjects } from './subjects/multilingual.subjects';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: configuration().mail.smtpHost,
        port: 465,
        secure: true,
        auth: {
          user: configuration().mail.user,
          pass: configuration().mail.pass,
        },
        tls: {
          rejectUnauthorized: configuration().mail.tls,
          ciphers: "SSLv3",
        },
      },
      defaults: {
        from: '"Ellty" ' + configuration().mail.from,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService, MultilingualSubjects],
  exports: [MailService],
})
export class MailModule {}
