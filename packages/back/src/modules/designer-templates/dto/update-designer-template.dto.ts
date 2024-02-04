import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignerTemplateDto } from './create-designer-template.dto';

export class UpdateDesignerTemplateDto extends PartialType(CreateDesignerTemplateDto) {}
