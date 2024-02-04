import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  Req,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import { PaypalPayService } from './services/paypal-pay.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SuccessDto } from './dto/success.dto';
import { ProductDto } from './dto/product.dto';
import { PlanDto } from './dto/plan.dto';
import { SubDto } from './dto/sub.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../../decorators/user.decorator';
import { IPAddress } from '../../decorators/IPAddress.decorator';

@ApiTags('PayPal')
@Controller('paypal-pay')
export class PaypalPayController {
  constructor(private readonly paypalPayService: PaypalPayService) {}

  @Get('/success')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  async success(
    @Query() succ: SuccessDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.paypalPayService.successPayPal(succ, res);
  }

  @Post('/create-product')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async product(@Body() req: ProductDto) {
    return await this.paypalPayService.createProduct(req);
  }

  @Post('/create-plan')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async plan(@Body() req: PlanDto) {
    return await this.paypalPayService.addPlan(req);
  }

  @Post('/create-sub')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async sub(@User() user, @Body() subDto: SubDto) {
    return await this.paypalPayService.createSub(user, subDto);
  }

  @Put('/cancel-sub')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
        },
      },
    },
  })
  async cancelSubscription(@User() user, @Body('reason') reason) {
    return await this.paypalPayService.cancelSubscription(user, reason);
  }

  @Get('/get-plans')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async plans(@IPAddress() userIP: string) {
    return await this.paypalPayService.getPlans(userIP);
  }

  @Get('/get-product')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async products() {
    return await this.paypalPayService.getProducts();
  }

  // @Post('/test')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  // async t(@Body() planId: string) {
  //     return await this.paypalPayService.getSinglePlan([planId])
  // }

  // @Get()
  // async test(@Body() dto: CreateDiscountPlan) {
  //   return await this.paypalPayService.createPlanWithCoupon(dto);
  // }
}
