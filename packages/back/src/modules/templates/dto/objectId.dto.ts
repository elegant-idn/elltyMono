import { Types} from "mongoose"
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsString} from "class-validator";

export class ObjectIdDto {
    @ApiProperty({type:String})
    @IsString()
    @IsNotEmpty()
    id: Types.ObjectId
}

export class ObjectIdsDto {
    @ApiProperty({type: String})
    @IsArray()
    @IsNotEmpty()
    ids: Types.ObjectId[]
}