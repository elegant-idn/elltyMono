import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreatePromocodeDto } from '../dto/create-promocode.dto';
import { UpdatePromocodeDto } from '../dto/update-promocode.dto';
import {InjectModel} from "@nestjs/mongoose";
import {PromoCode, PromoCodeDocument, PromoStatus} from "../../../schemas/promocode.schema";
import {Model} from "mongoose";
import {InjectStripe} from "nestjs-stripe";
import stripe from "stripe";
import {ObjectIdDto} from "../../templates/dto/objectId.dto";
import {PaypalPayService} from "../../paypal-pay/services/paypal-pay.service";
import {ValidatePayPalDto} from "../dto/validatePayPal.dto";
import {StripeCouponDto} from "../dto/stripeCoupon.dto";


@Injectable()
export class PromocodesService {
  constructor(@InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCodeDocument>,
              @InjectStripe() private readonly stripeClient: stripe,
              private readonly paypalPayService: PaypalPayService
  ) {}

  async createPromoCode(createPromocodeDto: CreatePromocodeDto) {
    const couponFromDb = await this.promoCodeModel.findOne({code: createPromocodeDto.code}).exec()
    if (couponFromDb) {
      throw new HttpException("coupon already exist in database try another name",HttpStatus.BAD_REQUEST)
    }
    const stripeCoupon = await this.stripeClient.coupons.create({
      name: createPromocodeDto.code,
      percent_off: createPromocodeDto.percent
    })

    const defaultPlans = await this.paypalPayService.getPlansByArray(createPromocodeDto.plans_id)

    if (!defaultPlans) {
        throw new HttpException("this paypal plan doesent exist, try another plan_id",HttpStatus.BAD_REQUEST)
    }
    console.log("default")
    console.log(defaultPlans)
    const plansWithDiscount = await this.paypalPayService.createPlansWithCoupon(defaultPlans, createPromocodeDto.percent)

    if (!plansWithDiscount) {
        throw new HttpException("something going wrong with create new plan(plan with discount) try again",HttpStatus.INTERNAL_SERVER_ERROR)
    }
    console.log("disc")
    console.log(plansWithDiscount)

    return await this.promoCodeModel.create({
      code: createPromocodeDto.code,
      status : PromoStatus.Active,
      percent : createPromocodeDto.percent,
      stripe_id : stripeCoupon.id,
      parent_plans: createPromocodeDto.plans_id.map(i => i),
      plans: plansWithDiscount,
    })
  }

  async findAll() {
    return await this.promoCodeModel.find().exec()
  }

  async getById({id}) {
    const singleCoupon = await this.promoCodeModel.findById(id).exec()


    if (!singleCoupon) {
      throw new HttpException("can't find this coupon, please create him",HttpStatus.BAD_REQUEST)
    }

    return singleCoupon._id
  }

  async getStripeCoupon(id): Promise<any>{
    const stripeCoupon = await this.stripeClient.coupons.retrieve(id)

    if (!stripeCoupon) {
        throw new HttpException("can't find this coupon in stripe, please contact with administrator", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return stripeCoupon
  }

  async validatePayPal(dto: ValidatePayPalDto){
    const singleCoupon = await this.promoCodeModel.findOne({code: dto.code, parent_plans: {$in: [dto.plan_id]}}).exec()

    if (!singleCoupon) {
        throw new HttpException("this coupon doesent exist",HttpStatus.BAD_REQUEST)
    }
    const index = singleCoupon.parent_plans.indexOf(dto.plan_id)
    if (index === -1) {
      throw new HttpException("this coupon exist in database, but doesent exist in paypal. Please contact with administrator",HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {plan_id: singleCoupon.plans[index]}
  }

  async ValidateStripe(dto: StripeCouponDto){
    const couponformDb = await this.promoCodeModel.findOne({code: dto.code}).exec()

    if (!couponformDb) {
        throw new HttpException("this coupon doesent exist",HttpStatus.BAD_REQUEST)
    }
    const stripeCoupon = await this.stripeClient.coupons.retrieve(couponformDb.stripe_id)
    if (!stripeCoupon) {
      throw new HttpException("this coupon doesent exist in stripe, please contact with administrator",HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {coupon_id: couponformDb._id}
  }

  async update(objectId: ObjectIdDto, updatePromocodeDto: UpdatePromocodeDto) {
    const couponFromDb = await this.promoCodeModel.findById(objectId.id).exec()
    if (!couponFromDb) {
      throw new HttpException("can't find this coupon, please create him", HttpStatus.BAD_REQUEST)
    }
    couponFromDb.code = updatePromocodeDto.code

    const StripeCoupon = await this.stripeClient.coupons.update(couponFromDb.stripe_id, {
      name: updatePromocodeDto.code
    })

    if (!StripeCoupon) {
      throw new HttpException("can't find this coupon in stripe, please check stripe and try again", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return await couponFromDb.save()
  }


  async remove(objectId: ObjectIdDto) {
    const coupon = await this.promoCodeModel.findByIdAndDelete(objectId.id).exec()
    if (!coupon) {
      throw new HttpException("this coupon doesent exist", HttpStatus.BAD_REQUEST)
    }
    const stripeCoupon = await this.stripeClient.coupons.del(coupon.stripe_id)

    if (stripeCoupon?.deleted) {
      throw new HttpException("can't delete this coupon from stripe, please check stripe and try again", HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return {deleted: stripeCoupon.deleted}
  }
}
