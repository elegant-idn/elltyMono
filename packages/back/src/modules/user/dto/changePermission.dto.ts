import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePermissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid: string;
}
