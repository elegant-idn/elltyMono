import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class StripeCouponDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code:string
}