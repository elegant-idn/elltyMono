import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {configuration} from "../../../config/configuration";
import {Strategy,Profile} from "@nicokaiser/passport-apple"
import {VerifyCallback} from "passport-google-oauth20";
const path = require('path');



@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, "apple") {
    constructor() {
        super({
            clientID: configuration().apple.client_id,
            teamID: configuration().apple.team_id,
            callbackURL: configuration().apple.redirect_uri,
            keyID: configuration().apple.key_id,
            key: configuration().apple.key_path,
            scope: ['name','email'],
            passReqToCallback: false
        });
    }

    async validate(accessToken, refreshToken, profile, cb:(err:any,user:any)=>void):Promise<any>{
        console.log("strategy vx: ", accessToken,refreshToken,profile)
        const {name, email} = profile;
        const user = {
            email: email,
            firstName: name.firstName,
            lastName: name.lastName,
            accessToken
        }
        cb(null,user)
    }

    // async validate(
    //     accessToken: string,
    //     refreshToken: string,
    //     profile: Profile,
    //     done: (err: any, user: any, info?: any) => void
    // ): Promise<any> {
    //     const { name, email } = profile;
    //     const user = {
    //         email: email,
    //         firstName: name.firstName,
    //         lastName: name.lastName,
    //     };
    //     const payload = {
    //         user,
    //         accessToken,
    //     };
    //
    //     done(null, payload);
    // }
}