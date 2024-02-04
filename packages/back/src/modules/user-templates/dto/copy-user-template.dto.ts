import { ApiProperty } from '@nestjs/swagger';

export class CopyUserTemplateDto {
  @ApiProperty({ type: 'string' })
  title: string;
}
