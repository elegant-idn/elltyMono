import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { jwtConstants } from '../constants';
import { JwtPayload } from '../interface/jwtPayload';
import { Request } from 'express';
import { isMobileUserAgent } from '../../../decorators/isMobile.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const isMobile = isMobileUserAgent(req);
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader.split(' ')[1];

    const isValid = await this.authService.validTokenExists(
      user,
      accessToken,
      isMobile,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
