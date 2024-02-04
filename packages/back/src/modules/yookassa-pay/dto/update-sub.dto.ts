import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePlanDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  plan: string;
}
