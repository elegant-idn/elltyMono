import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, VerifyCallback} from "passport-google-oauth20";
import {configuration} from "../../../config/configuration";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: configuration().google.clientID,
            clientSecret: configuration().google.clientSecret,
            callbackURL: configuration().google.callbackURL,
            scope: configuration().google.scope
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        console.log("google")
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }

    async authenticate(req, options) {
        const signedFrom = req.query?.from
        const encoded = signedFrom && new Buffer(JSON.stringify({from: signedFrom})).toString('base64')

        const stateParam = encoded ? { state: encoded } : {}

        super.authenticate(req, {...options, ...stateParam})
    }
}