import { IsOptional, IsString } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class FilterDto {
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  categories?: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  colors?: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  amount?: number = 34;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  offset?: number;
}
