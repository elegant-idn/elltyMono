import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class SuccessDto {
  @ApiProperty()
  @IsNotEmpty()
  subscription_id:string;
  @ApiProperty()
  @IsNotEmpty()
  ba_token:string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  userId:string
}