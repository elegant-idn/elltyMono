import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import * as geolite2 from 'geolite2';
import maxmind, { CountryResponse } from 'maxmind';
import { Model } from 'mongoose';
import { InjectStripe } from 'nestjs-stripe';
import stripe from 'stripe';
import { configuration } from '../../../config/configuration';
import { Payment, PaymentDocument } from '../../../schemas/payment.schema';
import { User, UserDocument, UserPlan } from '../../../schemas/user.schema';
import { PromocodesService } from '../../promocodes/service/promocodes.service';
import { CreateSubDto } from '../dto/price-id.dto';
import { SendyService } from '../../../utils/sendy.service';

//STRIPE_SECRET_KEY=sk_test_51KNDktGuxF2ecxamKasU91THHDtPAvKgHcD2DFJB7fIpIORfd3YWgN1sReBpnyClMKMuQv9jyFPg02Cn7XthUrDB00RgdmNOrA

@Injectable()
export class StripePayService {
  public constructor(
    @InjectStripe() private readonly stripeClient: stripe,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private promocodesService: PromocodesService,
    private readonly sendyService: SendyService,
  ) {}

  async successStripePay(user: UserDocument, subId: string) {
    //const user = await this.userModel.findOne({userId})
    // console.log(user)
    const sub = await this.stripeClient.subscriptions.retrieve(subId);
    if (!sub) {
      return new HttpException(
        'something going wrong contact with admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    console.log('this', sub.status);
    if (sub.status === 'active' || sub.status === 'trialing') {
      const payment = await this.paymentModel
        .findOneAndUpdate(
          { subId: sub.id, paymentType: 'stripe' },
          {
            status: sub.status,
          },
        )
        .exec();
      user.plan = UserPlan.pro;
      user.cancelSubscriptionDisabled = false;
      await user.save();

      await this.sendyService.unsubscribe(
        user.email,
        this.sendyService.getListId('payment-failed', user.language),
      );

      return {
        success: true,
      };
    } else {
      return new HttpException(
        'subscription expired',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async addProducts(name: string, price: number, interval) {
    const product = await this.stripeClient.products.create({
      name: name,
    });
    // current STRIPE_SECRET_KEY=sk_test_51JsjgVLnTf4V6Br3adkz5ag9YU4jy4U57r7zO50QAlLo1E1vNzJYdmGXTWqyNMhlnG2XvvqW0eMa7LWtyj6RY95j00RQBjdSy1sk_test_51JsjgVLnTf4V6Br3adkz5ag9YU4jy4U57r7zO50QAlLo1E1vNzJYdmGXTWqyNMhlnG2XvvqW0eMa7LWtyj6RY95j00RQBjdSy1
    const stripePrice = await this.stripeClient.prices.create({
      product: product.id,
      currency: process.env.STRIPE_CURRENCY,
      unit_amount: Number(price) * 100,
      recurring: {
        interval: interval,
      },
    });

    return {
      product,
      stripePrice,
    };
  }

  async getProduct() {
    const prices = await this.stripeClient.products.list({ active: true });
    return {
      prices: prices.data,
    };
  }

  async createRefund(user, token: string, amount) {
    const refund = await this.stripeClient.refunds.create({
      payment_intent: token,
      amount: amount,
    });
    return refund;
  }

  private countryBasedConfiguration =
    configuration().stripe.countryBasedPricing;

  getPriceMapForIP = async (userIP: string) => {
    const lookup = await maxmind.open<CountryResponse>(geolite2.paths.country);

    const countryISOCode = lookup.get(userIP)?.country?.iso_code;

    const { monthly, annual } =
      this.countryBasedConfiguration[countryISOCode] ?? {};

    return {
      monthly: monthly ?? configuration().stripe.defaultMonthlyPriceId,
      annual: annual ?? configuration().stripe.defaultAnnualPriceId,
      countryISO: countryISOCode,
    };
  };

  async getPrices(userIP: string) {
    const pricesForIP = await this.getPriceMapForIP(userIP);

    const prices = await Promise.all(
      [pricesForIP.monthly, pricesForIP.annual].map(async (priceId) => {
        const price = await this.stripeClient.prices.retrieve(priceId);

        return price;
      }),
    );

    const transformedPrices = prices.map((price) => {
      return {
        id: price.id,
        trial: price.recurring.trial_period_days ? true : false,
        amount: price.unit_amount,
        currency: price.currency,
        interval:
          price.recurring.interval == 'month'
            ? 'monthly'
            : price.recurring.interval == 'year'
            ? 'annual'
            : price.recurring.interval,
      };
    });

    return {
      prices: transformedPrices,
      countryISO: pricesForIP.countryISO,
    };
  }

  async createSubscription(user: User, createSub: CreateSubDto) {
    let createdCustomerId: string | null = null;
    try {
      const userid = await this.userModel.findOne({ uuid: user.uuid }).exec();
      const payment = await this.paymentModel
        .findOne({ userId: userid._id, paymentType: 'stripe' })
        .exec();
      if (user.plan == UserPlan.pro) {
        return new HttpException(
          'User already has pro status',
          HttpStatus.BAD_REQUEST,
        );
      }

      let customer_id: string | null;
      if (payment) {
        customer_id = payment.customerId;
      } else {
        const customer = await this.stripeClient.customers.create({
          payment_method: createSub.payment_method,
          name: user.firstName,
          email: user.email,
          invoice_settings: {
            default_payment_method: createSub.payment_method,
          },
        });

        customer_id = customer.id;
        createdCustomerId = customer.id;
      }

      await this.stripeClient.paymentMethods.attach(createSub.payment_method, {
        customer: customer_id,
      });
      const coupon = createSub.coupon_id
        ? await this.promocodesService.getStripeCoupon(createSub.coupon_id)
        : '';
      const subscription = await this.stripeClient.subscriptions.create({
        customer: customer_id,
        items: [
          {
            price: createSub.priceId,
          },
        ],
        coupon: coupon.id,
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await this.paymentModel.create({
        subId: subscription.id,
        customerId: subscription.customer,
        userId: userid._id,
        paymentType: 'stripe',
        status: subscription.status,
      });

      return {
        subscriptionId: subscription.id,
        clientSecret:
          subscription.latest_invoice['payment_intent']['client_secret'],
      };
    } catch (error) {
      if (createdCustomerId) {
        await this.stripeClient.customers.del(createdCustomerId);
      }

      console.log(error);
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async cancelSubscription(user: UserDocument) {
    const userPayment = await this.paymentModel
      .findOne({
        userId: user._id,
        paymentType: 'stripe',
        status: 'active',
      })
      .exec();

    if (userPayment) {
      const subId = userPayment.subId;
      const delSub = await this.stripeClient.subscriptions.del(subId);
      console.log(delSub);
      if (!delSub) {
        throw new HttpException(
          "this subId doesn't exist",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      userPayment.status = 'canceled';
      await userPayment.save();

      user.plan = UserPlan.free;
      user.downloadsCounter = 3;
      await user.save();
      return {
        success: true,
      };
    } else {
      throw new HttpException(
        "you don't have a subscription",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async webhook(req: Request, res: Response) {
    //whsec_BnlGrUbXBB6hCQ8Q81vN3SmplwnSz4fA
    const endpointSecret =
      'whsec_2897e9fec95b3ad4e0f098f776223650ff84a7b2b738f8ef8d2cbfc35f4d178e'; //test
    //const endpointSecret = "whsec_qMpzZlIaNoTvzZUDrYLryLjDhokH6JkS"//live
    //const endpointSecret = "we_1KhXaKLnTf4V6Br3F7svvHwX"
    const sig = req.headers['stripe-signature'];
    //console.log(sig)
    let event;
    try {
      event = await this.stripeClient.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret,
      );
    } catch (err) {
      console.log(err.message);
      return `Webhook Error: ${err.message}`;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const session = event.data.object;
        console.log('succeeded');
        console.log(session);
        console.log(event);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      }

      case 'payment_intent.payment_failed': {
        //to display errors (maybe not necessary, given that the error is already being displayed)
        console.log('payment broke');
        // const session = event.data.object;
        // console.log("to display error")
        // console.log(session)
        // Then define and call a function to handle the event checkout.session.completed
        break;
      }

      case 'charge.failed': {
        //to display errors (maybe not necessary, given that the error is already being displayed)
        console.log('charge.failed');
        // const session = event.data.object;
        // console.log("to display error")
        // console.log(session)
        // Then define and call a function to handle the event checkout.session.completed
        break;
      }

      case 'invoice.payment_failed': {
        //for delete customer, subscription and info from base
        const session = event.data.object;
        console.log('for delete customer');

        const customerId = session.customer;
        const subId = session.subscription;

        const payments = await this.paymentModel
          .find({ customerId: customerId, paymentType: 'stripe' })
          .exec();
        const paymentLastIndex = payments.length - 1;
        const payment = payments[paymentLastIndex];

        console.log(payments);
        console.log(customerId, payment);

        if (customerId && !payments.length)
          await this.stripeClient.customers.del(customerId);
        console.log(subId + ' sub id');
        console.log(session);
        if (subId) await this.stripeClient.subscriptions.del(subId);

        break;
      }

      case 'customer.deleted': {
        //catches customer deletion and delete his payments from base
        const session = event.data.object;
        console.log('customer deletion');
        console.log(
          session.last_payment_error && session.last_payment_error.message,
        );
        const customerId = session.customer;
        if (customerId) {
          console.log(
            await this.paymentModel.deleteMany({
              customerId: customerId,
              paymentType: 'stripe',
            }),
          );
        }

        break;
      }

      case 'customer.subscription.trial_will_end': {
        // email notification should be sent to user
        console.log('trial_will_end');
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.sendStatus(200);
  }
}
