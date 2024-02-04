import { ApiProperty } from '@nestjs/swagger';
import {IsArray, IsNotEmpty, IsObject, IsOptional, IsString} from "class-validator";

export class CreateTag {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;

}

export class CreateCategory {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;

}
