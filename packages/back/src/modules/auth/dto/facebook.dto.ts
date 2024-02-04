import {UserDto} from "./google.dto";

export class FacebookDto {
    user: FacebookUser;
}

class FacebookUser {
    user: UserDto;
}