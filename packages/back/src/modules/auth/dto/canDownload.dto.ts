import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CanDownloadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
