import { Module } from '@nestjs/common';
import { PromocodesService } from './service/promocodes.service';
import { PromocodesController } from './promocodes.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {PromoCode, PromoCodeSchema} from "../../schemas/promocode.schema";
import {PaypalPayModule} from "../paypal-pay/paypal-pay.module";
import {configuration} from "../../config/configuration";

@Module({
  imports: [
      MongooseModule.forFeature([{name: PromoCode.name, schema: PromoCodeSchema}]),
      PaypalPayModule.forRoot(
          configuration().paypal.environment,
          configuration().paypal.clientId,
          configuration().paypal.clientSecret,
      ),
  ],
  exports: [PromocodesService],
  controllers: [PromocodesController],
  providers: [PromocodesService]
})
export class PromocodesModule {}
