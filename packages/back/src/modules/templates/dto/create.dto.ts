import { ApiBody, ApiConsumes, ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { LanguageValidator } from 'src/validation/template-languages.validation';
export class CreateDto {
  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  categories: string;

  @ApiProperty()
  // @IsNotEmpty()
  colors: string;

  @ApiProperty()
  // @IsNotEmpty()
  tags: string;

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  width: string;

  @ApiProperty()
  @IsString()
  // @IsNotEmpty()
  height: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  // @IsNotEmpty()
  image: any;
  @ApiProperty({ type: 'string', format: 'binary' })
  // @IsNotEmpty()
  json: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(LanguageValidator)
  languages: string;
}

// export class CreateDto2 {
//   @ApiProperty()
//   data: string;
// }

export class EditTemplateDto extends PartialType(CreateDto) {}