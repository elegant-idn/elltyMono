import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class ValidatePayPalDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    plan_id:string

}