import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { configuration } from '../../../config/configuration';
import { User } from '../../../schemas/user.schema';
import { UserTemplate } from '../../../schemas/userTemplates.schema';
import { YookassaSubscription } from '../../../schemas/yookassa-subscription.schema';
import { capitalize } from '../../../utils/capitalize';
import { ChangeStatusTemplateDto } from '../../designer-templates/dto/change-status-template.dto';
import { MultilingualSubjects } from '../subjects/multilingual.subjects';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private multilingualSubjects: MultilingualSubjects,
  ) {}

  formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  async sendNotificationAboutTemplate(
    user: User,
    req: ChangeStatusTemplateDto,
    template: UserTemplate,
  ) {
    const userLanguage = user.language || 'en';
    await this.mailerService.sendMail({
      to: user.email,
      subject: this.multilingualSubjects.tamplateStatus(userLanguage),
      template: 'statusTemplate',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        template: `${template.preview[0]}`,
        status: `${req.status}`,
        description: `${
          req.description && req.status != 'accepted'
            ? req.description
            : "Your design is gorgeous! Let's create one more and let the others know how pro you are.\n" +
              '\n' +
              'Best, Ellty'
        }`,
      },
    });
  }

  async sendUserConfirmation(user: User, confirmationCode: string) {
    const userLanguage = user.language || 'en';

    await this.mailerService.sendMail({
      to: user.email,
      subject: this.multilingualSubjects.confirmEmail(userLanguage),
      template: `confirmation-${userLanguage}`,
      context: {
        name: user.firstName,
        confirmationCode,
      },
    });
  }

  async sendUserResetPassword(user: User, confirmationCode: string) {
    const userLanguage = user.language || 'en';

    await this.mailerService.sendMail({
      to: user.email,
      subject: this.multilingualSubjects.resetPassword(userLanguage),
      template: `resetPassword-${userLanguage}`,
      context: {
        name: user.firstName,
        confirmationCode,
      },
    });
  }

  async sendInfoAboutNewUser(user: User) {
    const userLanguage = user.language || 'en';
    await this.mailerService.sendMail({
      to: configuration().mail.email,
      subject: this.multilingualSubjects.newUser(userLanguage),
      template: 'infoAboutUser',
      context: {
        name: user.firstName,
        email: user.email,
      },
    });
  }

  async sendAdminCancellationEmail(user: User) {
    await this.mailerService.sendMail({
      to: configuration().mail.email,
      subject: 'Cancel subscription',
      template: 'userCancellation',
      context: {
        email: user.email,
      },
    });
  }

  async sendYookassaWillCancelEmail(
    user: User,
    subscription: YookassaSubscription,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirmation of Your Ellty Pro Subscription Cancellation',
      template: 'yookassaCancellation',
      context: {
        firstName: user.firstName,
        endDate: this.formatDate(subscription.paymentDue),
      },
    });
  }

  async sendYookassaAdminCancellationEmail(
    user: User,
    subscription: YookassaSubscription,
  ) {
    await this.mailerService.sendMail({
      to: configuration().mail.email,
      subject: 'Yookassa: User Has Cancelled the Subscription',
      template: 'yookassaAdminCancellation',
      context: {
        firstName: user.firstName,
        email: user.email,
        plan: capitalize(subscription.plan),
        endDate: this.formatDate(subscription.paymentDue),
      },
    });
  }

  async sendEmailUpdate(newEmail: string, emailToken: string, user: User) {
    const link = `${configuration().serverUrl}/user/update/email/${emailToken}`;
    const userLanguage = user.language || 'en';

    await this.mailerService.sendMail({
      to: newEmail,
      subject: this.multilingualSubjects.updateEmail(userLanguage),
      template: `emailUpdate-${userLanguage}`,
      context: {
        name: user.firstName,
        link,
      },
    });
  }
}
