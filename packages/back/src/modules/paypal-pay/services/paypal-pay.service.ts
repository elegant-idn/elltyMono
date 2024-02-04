import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Paypal from 'paypal-rest-sdk';
import { SuccessDto } from '../dto/success.dto';

import { ProductDto } from '../dto/product.dto';
import { PlanDto } from '../dto/plan.dto';
import { SubDto } from '../dto/sub.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../../../schemas/payment.schema';
import { Model } from 'mongoose';
import { User, UserDocument, UserPlan } from '../../../schemas/user.schema';
import { configuration } from '../../../config/configuration';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as geolite2 from 'geolite2';
import maxmind, { CountryResponse } from 'maxmind';
import {
  PromoCode,
  PromoCodeDocument,
} from '../../../schemas/promocode.schema';
import { SendyService } from '../../../utils/sendy.service';

const axios = require('axios');
const moment = require('moment');
const url = configuration().paypal.url;

@Injectable()
export class PaypalPayService {
  constructor(
    @Inject('PAYPAL_CLIENT') private paypal: Paypal,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PromoCode.name)
    private promoCodesModel: Model<PromoCodeDocument>,
    private jwtService: JwtService,
    private readonly sendyService: SendyService,
  ) {}

  async successPayPal(success: SuccessDto, res: Response) {
    const token = await this.getPayPalAccessToken();
    const options = {
      url: `${url}/v1/billing/subscriptions/${success.subscription_id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const { status, data } = await axios(options);
    if (data.status.toLowerCase() === 'active') {
      await this.paymentModel
        .findOneAndUpdate(
          { subId: success.subscription_id, baToken: success.ba_token },
          {
            status: data.status.toLowerCase(),
          },
        )
        .exec();
      await this.userModel
        .findOneAndUpdate(
          { uuid: success.userId },
          {
            plan: UserPlan.pro,
            cancelSubscriptionDisabled: false,
          },
        )
        .exec();

      const user = await this.userModel.findOne({ uuid: success.userId });

      await this.sendyService.unsubscribe(
        user.email,
        this.sendyService.getListId('payment-failed', user.language),
      );

      res.redirect(configuration().redirectURL);
    }
    // return {status, data}
  }

  async getProducts() {
    const token = await this.getPayPalAccessToken();
    const options = {
      url: `${url}/v1/catalogs/products`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    const { status, data } = await axios(options);
    return data;
  }

  private countryBasedConfiguration =
    configuration().paypal.countryBasedPricing;
  getPriceMapForIP = async (userIP: string) => {
    const lookup = await maxmind.open<CountryResponse>(geolite2.paths.country);

    const countryISO = lookup.get(userIP)?.country?.iso_code;

    const countryConfig = this.countryBasedConfiguration[countryISO];

    if (countryConfig === undefined) {
      return {
        monthly: configuration().paypal.defaultMonthlyPriceId,
        annual: configuration().paypal.defaultAnnualPriceId,
        countryISO,
      };
    }

    const { monthly, annual } = countryConfig ?? {};

    return {
      monthly,
      annual,
      countryISO,
    };
  };

  async getPlans(userIP: string) {
    const token = await this.getPayPalAccessToken();

    const userPriceResult = await this.getPriceMapForIP(userIP);

    const transformedPlans = await Promise.all(
      [userPriceResult.annual, userPriceResult.monthly]
        .filter((p) => !!p)
        .map(async (planId) => {
          const opt = {
            url: `${url}/v1/billing/plans/${planId}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          };

          const { status, data } = await axios(opt);
          const interval = data.billing_cycles.find((b) => {
            return b.tenure_type === 'REGULAR';
          });

          const trial = data.billing_cycles.find((b) => {
            return b.tenure_type === 'TRIAL';
          });

          return {
            id: data.id,
            trial: trial ? true : false,
            interval:
              interval.frequency.interval_unit == 'MONTH'
                ? 'monthly'
                : interval.frequency.interval_unit == 'YEAR'
                ? 'annual'
                : interval.frequency.interval_unit,
          };
        }),
    );

    return {
      plans: transformedPlans,
      countryISO: userPriceResult.countryISO,
    };
  }

  async getPlansByArray(plan_id: string[]) {
    const token = await this.getPayPalAccessToken();

    return Promise.all(
      plan_id.map(async (id) => {
        const options = {
          url: `${url}/v1/billing/plans/${id}`,
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };
        const { data } = await axios(options);

        return data;
      }),
    );
  }

  async createPlansWithCoupon(plans: any[], percent: number) {
    return Promise.all(
      plans.map(async (plan) => {
        const discount = +(
          (plan.billing_cycles[0].pricing_scheme.fixed_price.value * percent) /
          100
        ).toFixed(2);
        const newPrice =
          plan.billing_cycles[0].pricing_scheme.fixed_price.value - discount;
        console.log({
          discount,
          newPrice,
        });
        const token = await this.getPayPalAccessToken();
        const options = {
          method: 'POST',
          url: `${url}/v1/billing/plans`,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          data: {
            product_id: plan.product_id,
            name: plan.name,
            description: plan.description,
            billing_cycles: [
              {
                frequency: {
                  interval_unit: plan.billing_cycles[0].frequency.interval_unit,
                  interval_count:
                    plan.billing_cycles[0].frequency.interval_count,
                },
                tenure_type: plan.billing_cycles[0].tenure_type,
                sequence: 1,
                total_cycles: 12,
                pricing_scheme: {
                  fixed_price: {
                    value: newPrice,
                    currency_code: 'USD',
                  },
                },
              },
            ],
            payment_preferences: {
              auto_bill_outstanding: true,
              setup_fee: {
                value: newPrice,
                currency_code: 'USD',
              },
              setup_fee_failure_action: 'CONTINUE',
              payment_failure_threshold: 3,
            },
          },
        };
        const { data } = await axios(options);
        return data.id;
      }),
    );
  }

  async getPayPalAccessToken() {
    const client_id = configuration().paypal.clientId;
    const client_secret = configuration().paypal.clientSecret;
    const options = {
      url: `${url}/v1/oauth2/token`,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: client_id,
        password: client_secret,
      },
      params: {
        grant_type: 'client_credentials',
      },
    };
    const { status, data } = await axios(options);
    return data.access_token;
  }

  async createProduct(req: ProductDto) {
    const product = async () => {
      const token = await this.getPayPalAccessToken();
      console.log(token);
      const options = {
        method: 'POST',
        url: `${url}/v1/catalogs/products`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        data: {
          name: req.name,
          description: req.description,
          type: req.type,
        },
      };
      console.log(options);
      const { status, data } = await axios(options);
      return data;
    };
    return await product();
  }

  async addPlan(req: PlanDto) {
    const product = async () => {
      const token = await this.getPayPalAccessToken();
      const options = {
        method: 'POST',
        url: `${url}/v1/billing/plans`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        data: {
          product_id: req.product_id,
          name: req.name,
          description: 'premium plan',
          billing_cycles: [
            {
              frequency: {
                interval_unit: req.interval_unit,
                interval_count: req.interval_count,
              },
              tenure_type: req.tenure_type,
              sequence: 2,
              total_cycles: 12,
              pricing_scheme: {
                fixed_price: {
                  value: req.value,
                  currency_code: 'USD',
                },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
              value: req.value,
              currency_code: 'USD',
            },
            setup_fee_failure_action: 'CONTINUE',
            payment_failure_threshold: 3,
          },
        },
      };
      const { status, data } = await axios(options);
      return data;
    };
    return await product();
  }

  async createSub(user: User, subDto: SubDto) {
    if (user.plan === UserPlan.pro) {
      throw new HttpException(
        'User already has premium',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.getPayPalAccessToken();
    const options = {
      method: 'POST',
      url: `${url}/v1/billing/subscriptions`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      data: {
        plan_id: subDto.plan_id,
        subscriber: {
          name: {
            given_name: user.firstName,
          },
          email_address: user.email,
        },
        application_context: {
          brand_name: 'Ellty',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${configuration().serverUrl}/paypal-pay/success?userId=${
            user.uuid
          }`,
          cancel_url: `${configuration().host}`,
        },
      },
    };
    //cancel_url: `${configuration().elltyApi}/paypal-pay/cancel?userId=${user.uuid}`,
    const { status, data } = await axios(options);

    const link = data.links.find((link) => {
      return link.rel === 'approve';
    });

    return {
      data,
      link,
    };
  }

  async cancelSubscription(user: UserDocument, reason: string = 'reason') {
    const userPayment = await this.paymentModel
      .findOne({
        userId: user._id,
        paymentType: 'paypal',
        status: 'active',
      })
      .exec();

    if (userPayment) {
      const subId = userPayment.subId;

      const token = await this.getPayPalAccessToken();
      const options = {
        method: 'POST',
        url: `${url}/v1/billing/subscriptions/${subId}/cancel`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        data: {
          reason: reason,
        },
      };
      const { status } = await axios(options);
      if (status !== HttpStatus.NO_CONTENT) {
        throw new HttpException(
          'something going wrong with delete subscription',
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
}
