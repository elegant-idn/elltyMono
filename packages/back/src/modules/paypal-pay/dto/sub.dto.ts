import { ApiProperty } from '@nestjs/swagger';
import {IsOptional, IsString, IsNotEmpty} from "class-validator";
import {Types} from "mongoose"

export class SubDto{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plan_id:string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // coupon_id?:Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
  url?:string
}