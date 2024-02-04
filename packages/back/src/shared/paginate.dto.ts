import {ApiModelPropertyOptional} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import {IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class PaginateDto{
    @ApiProperty({default:34})
    @IsString()
    amount?: number=34;

    @ApiProperty({default:1})
    @IsString()
    offset?: number=1;
}