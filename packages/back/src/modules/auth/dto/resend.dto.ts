import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString} from "class-validator";

export enum QueryTypes {
    confirm = 'confirm',
    reset = 'reset'
}

export class ResendDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({enum: QueryTypes})
    @IsString()
    type: QueryTypes;
}

