import {
  ICapturePayment,
  ICreatePayment,
  IReceipt,
  YooCheckout,
} from '@a2seven/yoo-checkout';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  YookassaSubscription,
  YookassaSubscriptionDocument,
} from 'src/schemas/yookassa-subscription.schema';
import { v4 as uuidv4 } from 'uuid';
import { configuration } from '../../config/configuration';
import { User, UserDocument, UserPlan } from '../../schemas/user.schema';
import { SendyService } from '../../utils/sendy.service';
import { MailService } from '../mail/services/mail.service';

const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

@Injectable()
export class YookassaSubsciptionService {
  constructor(
    @Inject('YOOKASSA_CLIENT') private yookassa: YooCheckout,
    @InjectModel(YookassaSubscription.name)
    private yookassaSubscriptionModel: Model<YookassaSubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly sendyService: SendyService,
  ) {}
  @Cron(CronExpression.EVERY_HOUR)
  async checkSubscription() {
    try {
      console.log('✭✭✭✭✭✭✭✭✭ task scheduler has started ✭✭✭✭✭✭✭');
      const subscriptions = await this.yookassaSubscriptionModel.find({
        paymentDue: { $lte: new Date() },
        status: {
          $ne: 'canceled',
        },
      });
      if (!subscriptions.length) return;
      for (const subscription of subscriptions) {
        if (subscription.status == 'active') {
          const user = await this.userModel.findById(subscription.userId);

          if (!user) {
            console.error('Attention! Subscription user not found');

            continue;
          }

          let payment = await this.createPayment(
            subscription.price,
            subscription.paymentMethodId,
            user,
            subscription.plan,
          );
          if (!payment) {
            console.error('Attention! Payment not created');
            await this.cancelSubscription(
              subscription._id,
              subscription.userId,
            );
            continue;
          }
          const capturedPayment = await this.capturePayment(
            subscription.price,
            payment.id,
          );
          if (!capturedPayment) {
            console.error('Attention! Payment not captured');
            await this.cancelSubscription(
              subscription._id,
              subscription.userId,
            );
            continue;
          }
          subscription.paymentDue =
            subscription.plan == 'monthly' ? nextMonth : nextYear;
          await subscription.save();
        } else if (subscription.status === 'will-cancel') {
          await this.cancelPayment(subscription.paymentMethodId);
          subscription.status = 'canceled';
          await subscription.save();
          await this.userModel.findByIdAndUpdate(subscription.userId, {
            plan: UserPlan.free,
          });

          const user = await this.userModel.findById(subscription.userId);

          await this.mailService.sendProPlanHasExpired(user);
        } else if (subscription.status === 'pending') {
          const payment = await this.getPayment(subscription.paymentMethodId);
          if (!payment || payment.status === 'canceled') {
            await this.yookassaSubscriptionModel.findByIdAndDelete(
              subscription._id,
            );
            await this.userModel.findByIdAndUpdate(subscription.userId, {
              plan: UserPlan.free,
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async cancelSubscription(subscriptionId: string, userId: string) {
    try {
      const subscription =
        await this.yookassaSubscriptionModel.findByIdAndUpdate(subscriptionId, {
          status: 'canceled',
        });
      const user = await this.userModel.findByIdAndUpdate(userId, {
        plan: UserPlan.free,
      });

      await this.mailService.sendPaymentFailed(user);
      await this.mailService.sendPaymentFailedAdmin(user, subscription);

      await this.sendyService.subscribe(
        user.email,
        this.sendyService.getListId('payment-failed', user.language),
        user.firstName,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createPayment(
    price: string,
    paymentMethodId: string,
    user: User,
    plan: string,
  ) {
    try {
      const idempotenceKey = uuidv4();

      // phone, email are deprecated, set them on customer object
      const receipt: Omit<IReceipt, 'phone' | 'email'> = {
        customer: {
          email: user.email,
        },
        items: [
          {
            description:
              plan === 'monthly'
                ? 'Ellty Pro ежемесячная подписка'
                : 'Ellty Pro годовая подписка',
            amount: {
              value: price,
              currency: configuration().yookassa.currency,
            },
            quantity: '1',
            vat_code: 1,
          },
        ],
      };

      const createPayload: ICreatePayment = {
        amount: {
          value: price,
          currency: configuration().yookassa.currency,
        },
        payment_method_id: paymentMethodId,
        confirmation: {
          type: 'redirect',
          return_url: 'https://www.ellty.com/',
        },
        receipt: receipt as IReceipt,
      };

      return await this.yookassa.createPayment(createPayload, idempotenceKey);
    } catch (error) {
      console.log(error);
    }
  }

  // async createPayment(price: string, paymentMethodId: string) {
  //   const idempotenceKey = uuidv4();
  //   const createPayload = {
  //     payment_method_id: paymentMethodId,
  //     amount: {
  //       value: price,
  //       currency: configuration().yookassa.currency,
  //     },
  //     capture: true,
  //     refundable: true,
  //   };
  //   const { data: payment } = await axios({
  //     method: 'post',
  //     url: 'https://api.yookassa.ru/v3/payments',
  //     data: createPayload,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Idempotence-Key': idempotenceKey,
  //     },
  //     auth: {
  //       username: configuration().yookassa.shopId,
  //       password: configuration().yookassa.secretKey,
  //     },
  //   });
  //   return payment;
  // }

  async getPayment(paymentId: string) {
    try {
      return await this.yookassa.getPayment(paymentId);
    } catch (error) {
      console.error(error);
    }
  }

  async capturePayment(price: string, paymentId: string) {
    try {
      const idempotenceKey = uuidv4();
      const capturePayload: ICapturePayment = {
        amount: {
          value: price,
          currency: configuration().yookassa.currency,
        },
      };
      return await this.yookassa.capturePayment(
        paymentId,
        capturePayload,
        idempotenceKey,
      );
    } catch (error) {
      console.error(error);
    }
  }

  async cancelPayment(paymentId: string) {
    try {
      const idempotenceKey = uuidv4();
      return await this.yookassa.cancelPayment(paymentId, idempotenceKey);
    } catch (error) {
      console.error(error);
    }
  }
}
