import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  plan: string;

  // @ApiProperty({ type: String, required: true })
  // @IsNotEmpty()
  // @IsString()
  // paymentToken: string;
}
