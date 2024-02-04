import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";


export class CreatePromocodeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    percent:number;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    plans_id:string[];
}