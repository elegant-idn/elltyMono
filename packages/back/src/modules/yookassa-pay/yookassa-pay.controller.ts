import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Req,
  Res,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../../decorators/user.decorator';
import { YookassaPayService } from './yookassa-pay.service';
import { CreateSubDto } from './dto/create-sub.dto';
import { ChangePlanDto } from './dto/update-sub.dto';

@ApiTags('Yookassa')
@Controller('yookassa-pay')
export class YookassaPayController {
  constructor(private yookassaPayService: YookassaPayService) {}

  @Post('/create-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async createSubscription(@User() user, @Body() body: CreateSubDto) {
    return await this.yookassaPayService.createSubscription(user, body);
  }

  @Post('/webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    return await this.yookassaPayService.webhook(req, res);
  }

  @Put('/cancel-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async cancelSubscription(@User() user) {
    return await this.yookassaPayService.cancelSubscription(user);
  }

  @Get('/check-subscriber')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async checkIfNewSubscriber(@User() user) {
    return await this.yookassaPayService.checkIfUserSubscribed(user);
  }

  @Put('/change-plan')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async updateSubscription(@User() user, @Body() body: ChangePlanDto) {
    return await this.yookassaPayService.changePlan(user, body);
  }
}
