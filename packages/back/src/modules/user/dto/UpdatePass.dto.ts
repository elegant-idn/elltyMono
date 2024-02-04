import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UpdatePassDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currentPass: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    newPass: string
}

export class UpdateEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string

    @ApiProperty()
    @IsString()
    password: string
}
