import {DesignerTemplateStatus} from "../../../schemas/designerTemplates.schema";
import {ApiProperty} from "@nestjs/swagger";

export class ChangeStatusTemplateDto {
    @ApiProperty()
    description:string;
    @ApiProperty({enum:DesignerTemplateStatus})
    status:DesignerTemplateStatus;
    @ApiProperty()
    title:string;
}
