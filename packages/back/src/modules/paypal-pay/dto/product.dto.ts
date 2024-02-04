import { ApiProperty } from '@nestjs/swagger';

export enum type{
  PHYSICAL='PHYSICAL',
  DIGITAL='DIGITAL',
  SERVICE='SERVICE',
}

export class ProductDto {
  @ApiProperty({default:'premium'})
  name: string;
  @ApiProperty({default:'premium account'})
  description: string;
  @ApiProperty({enum:type,default:type.DIGITAL})
  type: type = type.DIGITAL;
}