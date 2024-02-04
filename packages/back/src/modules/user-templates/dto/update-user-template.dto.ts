import { PickType } from '@nestjs/swagger';
import { CreateUserTemplateDto } from './create-user-template.dto';

export class UpdateUserTemplateDto extends PickType(CreateUserTemplateDto, [
  'template',
  'temporaryUserToken',
  'height',
  'width',
] as const) {}
