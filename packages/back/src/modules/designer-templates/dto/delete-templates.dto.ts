import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty} from "class-validator";

export class DeleteTemplatesDto{
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    ids:[]
}
