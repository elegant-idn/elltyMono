import { ApiProperty } from '@nestjs/swagger';

export class AddPreviewUserTemplateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  preview: any;

  @ApiProperty()
  temporaryUserToken: any;
}
