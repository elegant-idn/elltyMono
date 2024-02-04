import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import {
  YookassaSubscription,
  YookassaSubscriptionDocument,
} from '../../schemas/yookassa-subscription.schema';
import { MailService } from '../mail/services/mail.service';

interface NotifyDataEntry {
  user: User;
  renewalDate: Date;
  plan: 'monthly' | 'yearly';
  price: {
    amount: number;
    currency: string;
  };
}

const RUN_NOTIFY_INTERVAL = 1000 * 60 * 10; // 10 minutes
const SEND_NOTIFY_INTERVAL = 1000 * 1; // 1 second

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(YookassaSubscription.name)
    private yookassaSubscriptionModel: Model<YookassaSubscriptionDocument>,
    private mailService: MailService,
  ) {}

  @Interval(RUN_NOTIFY_INTERVAL)
  async notifyBeforePayment() {
    console.log('[Interval] Notify before payment has started');
    const notifyDataEntries = await this.getNotifyUsersNotifyData(
      this.getNotifyAfterDate(),
      this.getNotifyBeforeDate(),
    );

    for (let i = 0; i < notifyDataEntries.length; i++) {
      if (i !== 0) {
        await new Promise((r) => setTimeout(r, SEND_NOTIFY_INTERVAL));
      }

      const notifyEntry = notifyDataEntries[i];

      await this.mailService.sendRenewalReminderEmail(
        notifyEntry.user,
        notifyEntry.plan,
        notifyEntry.price,
        notifyEntry.renewalDate,
      );
    }
  }

  private getNotifyBeforeDate = () => {
    return new Date(this.getNotifyAfterDate().getTime() + RUN_NOTIFY_INTERVAL);
  };

  private getNotifyAfterDate = () => {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  };

  private convertYookassaSubscriptionToNotifyData = (
    subscription: YookassaSubscriptionDocument,
  ): NotifyDataEntry => {
    return {
      user: subscription.user,
      plan: subscription.plan,
      price: {
        amount: parseInt(subscription.price),
        currency: 'RUB',
      },
      renewalDate: subscription.paymentDue,
    };
  };

  private cleanNotifyData = (notifyData: NotifyDataEntry): NotifyDataEntry => {
    return notifyData;
  };

  private getNotifyUsersNotifyData = async (
    paymentDueDateFrom: Date,
    paymentDueDateTo: Date,
  ) => {
    const notifyDataEntries: NotifyDataEntry[] = [];

    const yookassaSubscriptions = await this.yookassaSubscriptionModel
      .find({
        paymentDue: { $gt: paymentDueDateFrom, $lte: paymentDueDateTo },
        status: 'active',
      })
      .populate({
        path: 'user',
        select: 'firstName lastName email',
      });

    yookassaSubscriptions.forEach((subscription) => {
      notifyDataEntries.push(
        this.convertYookassaSubscriptionToNotifyData(subscription),
      );
    });

    return notifyDataEntries.map(this.cleanNotifyData);
  };
}
