import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../../schemas/user.schema';
import { YookassaSubscription } from '../../../schemas/yookassa-subscription.schema';
import { capitalize } from '../utils/capitalize';
import { configuration } from '../../../config/configuration';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  formatPrice = (user: User, price: { amount: number; currency: string }) => {
    const formatter = new Intl.NumberFormat(user.language, {
      currency: price.currency,
      style: 'currency',
      maximumFractionDigits: price.currency === 'RUB' ? 0 : undefined,
    });

    return formatter.format(price.amount);
  };

  async sendRenewalReminderEmail(
    user: User,
    plan: string,
    price: { amount: number; currency: string },
    renewalDate: Date,
  ) {
    const renewalDateString = this.formatDate(renewalDate);

    const priceString = this.formatPrice(user, price);

    await this.mailerService.sendMail({
      to: user.email,
      subject:
        'Heads Up! Your Ellty Subscription Renewal is Just Around the Corner',
      template: 'paymentReminder',
      context: {
        firstName: user.firstName,
        renewalDateString,
        plan: capitalize(plan),
        priceString,
      },
    });
  }

  async sendProPlanHasExpired(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Ellty Pro Plan Has Expired',
      template: 'hasCancelled',
      context: {
        firstName: user.firstName,
      },
    });
  }

  async sendPaymentFailed(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Unsuccessful Payment Attempt - Your Ellty Pro Subscription',
      template: 'paymentFailed',
      context: {
        firstName: user.firstName,
      },
    });
  }

  async sendPaymentFailedAdmin(user: User, subscription: YookassaSubscription) {
    await this.mailerService.sendMail({
      to: configuration().mail.email,
      subject: 'Yookassa: Unsuccessful Attempt at Recurring Payment',
      template: 'paymentFailedAdmin',
      context: {
        email: user.email,
        plan: capitalize(subscription.plan),
      },
    });
  }
}
