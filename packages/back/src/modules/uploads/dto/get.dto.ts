import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsOptional, IsString } from 'class-validator';

export class GetDto {
  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  amount?: number = 34;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  page?: number = 0;
}
