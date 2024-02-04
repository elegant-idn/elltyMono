import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LanguageTypes } from 'src/utils/languages';
export class EditUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  language?: LanguageTypes;
  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // deleteAvatar?: boolean
}
