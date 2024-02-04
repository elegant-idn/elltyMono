import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsOptional} from "class-validator";

export class GetAllUserFoldersDto{
    @ApiProperty({required:false})
    @IsOptional()
    folder:string
}
