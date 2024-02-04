import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserPlan } from '../../schemas/user.schema';
import {
  YookassaSubscription,
  YookassaSubscriptionDocument,
} from 'src/schemas/yookassa-subscription.schema';
import { CreateSubDto } from './dto/create-sub.dto';
import { configuration } from '../../config/configuration';
import { ChangePlanDto } from './dto/update-sub.dto';
import { SendyService } from '../../utils/sendy.service';
const axios = require('axios');

const month = 30 * 24 * 60 * 60 * 1000;
const year = 365 * 24 * 60 * 60 * 1000;
@Injectable()
export class YookassaPayService {
  constructor(
    @Inject('YOOKASSA_CLIENT') private yookassa: YooCheckout,
    @InjectModel(YookassaSubscription.name)
    private yookassaSubscriptionModel: Model<YookassaSubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly sendyService: SendyService,
  ) {}

  async checkIfUserSubscribed(user: User) {
    const curretUser = await this.userModel.findOne({ uuid: user.uuid }).exec();
    const subscriber = await this.yookassaSubscriptionModel.findOne({
      userId: curretUser._id,
    });
    return subscriber;
  }

  async createSubscription(user: User, body: CreateSubDto) {
    console.log('Here', body);
    try {
      const currentUser = await this.userModel
        .findOne({ uuid: user.uuid })
        .exec();

      if (currentUser.plan === UserPlan.pro) {
        return new HttpException(
          'User already has pro status',
          HttpStatus.BAD_REQUEST,
        );
      }
      const { price, plan } = body;
      const payment = await this.createPayment(price, user, plan);

      if (!payment) {
        return new HttpException(
          'Something went wrong! Please please try again.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const subscriber = await this.yookassaSubscriptionModel.findOne({
        userId: currentUser._id,
      });
      console.log('subscriber', subscriber);
      if (subscriber) {
        subscriber.price = payment.amount.value;
        subscriber.paymentMethodId = payment.id;
        subscriber.status = 'pending';
        subscriber.plan = plan;
        subscriber.paymentDue =
          plan === 'monthly'
            ? new Date(Date.now() + month)
            : new Date(Date.now() + year);

        await subscriber.save();
      } else {
        await this.yookassaSubscriptionModel.create({
          email: currentUser.email,
          userId: currentUser._id,
          price: payment.amount.value,
          paymentMethodId: payment.id,
          status: 'pending',
          plan,
          paymentDue:
            plan === 'monthly'
              ? new Date(Date.now() + month)
              : new Date(Date.now() + year),
        });
      }
      return payment;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Something went wrong! Please please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async webhook(req: Request, res: Response) {
    try {
      const notification = req.body;
      console.log(notification);
      if (notification.event === 'payment.waiting_for_capture') {
        const subscriber = await this.yookassaSubscriptionModel.findOne({
          paymentMethodId: notification.object.id,
          status: 'pending',
        });
        if (!subscriber) {
          console.error('Subscriber not found for payment');
          return;
        }
        const user = await this.userModel.findOne({ _id: subscriber.userId });
        if (!user) {
          console.error('User not found for payment');
          return;
        }
        const capturedPayment = await this.capturePayment(notification.object);
        if (!capturedPayment || capturedPayment.status !== 'succeeded') {
          console.error('Payment capture failed');
          return;
        }
        subscriber.status = 'active';
        await subscriber.save();

        await this.sendyService.unsubscribe(
          user.email,
          this.sendyService.getListId('payment-failed', user.language),
        );

        user.plan = UserPlan.pro;
        user.cancelSubscriptionDisabled = false;
        await user.save();
      }
      return res.status(HttpStatus.OK).json({});
    } catch (err) {
      console.error('Attention cannot handle webhook');
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
    }
  }
  async cancelSubscription(user: UserDocument) {
    try {
      const subscriber = await this.yookassaSubscriptionModel.findOne({
        userId: user._id,
        status: 'active',
      });
      if (!subscriber) {
        return new HttpException(
          'User has no subscription!',
          HttpStatus.BAD_REQUEST,
        );
      }
      subscriber.status = 'will-cancel';
      await subscriber.save();
      return HttpStatus.OK;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Something went wrong! Please please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPayment(price: string, user: User, plan: string) {
    const idempotenceKey = uuidv4();
    const createPayload = {
      amount: {
        value: price,
        currency: configuration().yookassa.currency,
      },
      save_payment_method: true,
      payment_method: {
        type: 'bank_card',
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://www.ellty.com',
        enforce: false,
      },
      capture: false,
      refundable: true,
      receipt: {
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
      },
    };

    const { data: payment } = await axios({
      method: 'post',
      url: 'https://api.yookassa.ru/v3/payments',
      data: createPayload,
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
      },
      auth: {
        username: configuration().yookassa.shopId,
        password: configuration().yookassa.secretKey,
      },
    });
    return payment;
  }
  async capturePayment(payment) {
    return await this.yookassa.capturePayment(
      payment.id,
      {
        amount: {
          value: payment.amount.value,
          currency: payment.amount.currency,
        },
      },
      uuidv4(),
    );
  }

  async changePlan(user: User, dto: ChangePlanDto) {
    try {
      const currentUser = await this.userModel
        .findOne({ uuid: user.uuid })
        .exec();

      if (!currentUser) {
        return new HttpException(
          'Current user not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const subscription = await this.yookassaSubscriptionModel.findOne({
        userId: currentUser._id,
      });

      if (!subscription) {
        return new HttpException(
          'Yookassa subscription was not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (['will-cancel', 'canceled'].includes(subscription.status)) {
        return new HttpException(
          "Can't upgrade cancelled subscription",
          HttpStatus.CONFLICT,
        );
      }

      const { price, plan } = dto;

      subscription.price = price;
      subscription.plan = plan;

      await subscription.save();

      return {
        nextPaymentDate: subscription.paymentDue,
        nextAmount: price,
      };
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Something went wrong! Please please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*  PLEASE DON'T DELETE COMMENTED CODE IS FOR MAKING PAYMENTS USING TOKENS  */
  // async createSubscription(user: User, body: CreateSubDto) {
  //   try {
  //     const curretUser = await this.userModel
  //       .findOne({ uuid: user.uuid })
  //       .exec();

  //     if (curretUser.plan === UserPlan.pro) {
  //       return new HttpException(
  //         'User already has pro status',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const { price, plan, paymentToken } = body;
  //     const idempotenceKey = uuidv4();
  //     const createPayload: ICreatePayment = {
  //       amount: {
  //         value: price,
  //         currency: configuration().yookassa.currency,
  //       },
  //       payment_token: paymentToken,
  //       save_payment_method: true,
  //       confirmation: {
  //         type: 'redirect',
  //         return_url: 'https://www.ellty.com',
  //         enforce: false,
  //       },
  //     };
  //     const payment = await this.yookassa.createPayment(
  //       createPayload,
  //       idempotenceKey,
  //     );
  //     if (
  //       !payment ||
  //       payment.status === 'pending' ||
  //       payment.status === 'canceled'
  //     ) {
  //       return new HttpException(
  //         'Your payment is not confirmed! Please try again.',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const subscriber = await this.yookassaSubscriptionModel.findOne({
  //       userId: curretUser._id,
  //     });
  //     if (subscriber) {
  //       const capturedPayment = await this.yookassa.capturePayment(
  //         payment.id,
  //         {
  //           amount: {
  //             value: payment.amount.value,
  //             currency: payment.amount.currency,
  //           },
  //         },
  //         uuidv4(),
  //       );
  //       if (!capturedPayment || capturedPayment.status !== 'succeeded') {
  //         return new HttpException(
  //           'Your payment is not confirmed! Please try again.',
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }
  //       subscriber.paymentMethodId = payment.id;
  //       subscriber.status = 'active';
  //       subscriber.plan = plan;
  //       subscriber.isTrial = false;
  //       subscriber.paymentDue = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  //       await subscriber.save();
  //     } else {
  //       await this.yookassaSubscriptionModel.create({
  //         userId: curretUser._id,
  //         price: payment.amount.value,
  //         paymentMethodId: payment.id,
  //         status: 'active',
  //         plan,
  //         isTrial: true,
  //         paymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //       });
  //     }
  //     curretUser.plan = UserPlan.pro;
  //     await curretUser.save();
  //     return payment;
  //   } catch (error) {
  //     console.log(error);
  //     return new HttpException(
  //       'Something went wrong! Please please try again.',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
