import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  images: any;

  @ApiProperty({ type: 'array' })
  names: string[] | string;
}
