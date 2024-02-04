import { PickType } from '@nestjs/swagger';
import { CreateUserTemplateDto } from './create-user-template.dto';

export class UpdateUserTemplateTitleDto extends PickType(
  CreateUserTemplateDto,
  ['title'] as const,
) {}
