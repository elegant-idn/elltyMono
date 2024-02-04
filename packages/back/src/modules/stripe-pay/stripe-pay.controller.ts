import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { StripePayService } from './services/stripe-pay.service';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AddProductDto } from './dto/add-product.dto';
import { CreateSubDto } from './dto/price-id.dto';
import { Request, Response } from 'express';
import { User } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { IPAddress } from '../../decorators/IPAddress.decorator';

@ApiTags('Stripe')
@Controller('stripe-pay')
export class StripePayController {
  constructor(private readonly stripePayService: StripePayService) {}

  @Put('/success-stripe')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async success(@User() user, @Body('subId') subId: string) {
    return await this.stripePayService.successStripePay(user, subId);
  }

  @Post('/create-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async createSubscription(@User() user, @Body() createSub: CreateSubDto) {
    return await this.stripePayService.createSubscription(user, createSub);
  }

  @Post('/refund-amount')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async createRefund(
    @User() user,
    @Body() data: { paymentIntent: string; amount: number },
  ) {
    return await this.stripePayService.createRefund(
      user,
      data.paymentIntent,
      data.amount,
    );
  }

  @Put('/cancel-sub')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async cancelSubscription(@User() user) {
    return await this.stripePayService.cancelSubscription(user);
  }

  @Get('/prices')
  async getPrices(@IPAddress() userIP: string) {
    return await this.stripePayService.getPrices(userIP);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Get('/products')
  async getProduct() {
    return await this.stripePayService.getProduct();
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post('/add-products')
  async addProducts(@Body() { name, price, interval }: AddProductDto) {
    return await this.stripePayService.addProducts(name, price, interval);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @Post('/webhook')
  async webhook(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.stripePayService.webhook(req, res);
  }
}
