import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFolderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  folder: string;
}
