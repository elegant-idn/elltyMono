import {Types} from "mongoose";
import {IsOptional} from "class-validator";
import {DesignerTemplateStatus} from "../../../schemas/designerTemplates.schema";
import {ApiProperty} from "@nestjs/swagger";

export class GetAllReqDesignerTemplates {
    @ApiProperty({type:String,required:false})
    @IsOptional()
    user_id: Types.ObjectId
    @ApiProperty({enum:DesignerTemplateStatus,required:false})
    @IsOptional()
    status:DesignerTemplateStatus

}

export class GetAllReqUserDesignerTemplates{
    @ApiProperty({enum:DesignerTemplateStatus,required:false})
    @IsOptional()
    status:DesignerTemplateStatus
}