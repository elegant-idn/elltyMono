import {IsEmail} from "class-validator";

export class GoogleDto {
    user: UserDto;
    query: { state: string }
}

export class UserDto {
    uuid: string;
    @IsEmail()
    email: string;
}