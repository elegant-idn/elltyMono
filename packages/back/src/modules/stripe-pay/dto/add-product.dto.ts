import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

enum interval {
  month = "month",
  year = "year"
}

export class AddProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  interval: interval;
}
