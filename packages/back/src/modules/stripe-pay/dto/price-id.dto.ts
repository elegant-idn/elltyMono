import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateSubDto{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  priceId:string

  @ApiProperty()
  @IsString()
  @IsOptional()
  coupon_id?:string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  payment_method?:string
}


