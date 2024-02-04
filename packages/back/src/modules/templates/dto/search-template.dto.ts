import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;
}
