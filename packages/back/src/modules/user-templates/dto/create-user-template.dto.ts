import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTemplateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  template: any;
  @ApiProperty()
  title: string;
  @ApiProperty()
  temporaryUserToken?: string;
  @ApiProperty()
  categoryId?: string;

  @ApiProperty({ type: 'number' })
  height?: number;

  @ApiProperty({ type: 'number' })
  width?: number;
}
