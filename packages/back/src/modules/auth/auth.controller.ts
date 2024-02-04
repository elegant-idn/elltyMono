import { AuthService } from './services/auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { ConfirmMailDto } from './dto/confirmMail.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from './interface/jwtPayload';
import { ResetConfirmDto, ResetDto } from './dto/reset.dto';
import { ChangePassDto } from './dto/changePassDto';
import { clearUserDto } from '../user/utils/clearUserDto';
import { GoogleDto } from './dto/google.dto';
import { FacebookDto } from './dto/facebook.dto';
import { configuration } from '../../config/configuration';
import { ResendDto } from './dto/resend.dto';
import { Response, Request } from 'express';
import { User } from '../../decorators/user.decorator';
import { AppleDto } from './dto/apple.dto';
import passport from 'passport';
import { URL } from 'url';
import { MailchimpService } from '../../utils/mailchimp.service';
import { IsMobileDevice } from '../../decorators/isMobile.decorator';
import { IPAddress } from '../../decorators/IPAddress.decorator';

const decodeState = (encoded?: string) => {
  if (encoded) {
    try {
      const decoded = new Buffer(encoded, 'base64').toString();

      return JSON.parse(decoded);
    } catch (e) {
      console.error('State payload not decoded, going with defaults');
    }
  }

  return {};
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @ApiBody({ type: SignInDto })
  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() signInData: SignInDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @IsMobileDevice() isMobile: boolean,
  ) {
    return this.authService.signIn(signInData, res, req, undefined, isMobile);
  }

  @ApiBody({ type: SignUpDto })
  @Post('signup')
  async signUp(
    @Body() signUpData: SignUpDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const user = await this.authService.signUp(signUpData, res, req);
    console.log('user: ', user);
    return user;
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  public async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  public async me(@User() user): Promise<JwtPayload> {
    return await this.authService.getCurrentUser(user);
  }

  @ApiBody({ type: ConfirmMailDto })
  @Post('confirmation')
  public async confirmEmail(
    @Body() confirmMailDto: ConfirmMailDto,
    @IsMobileDevice() isMobile: boolean,
  ) {
    return this.authService.confirmMail(confirmMailDto, isMobile);
  }

  @ApiBody({ type: ResendDto })
  @Post('resend')
  public async resendCode(
    @Body() resendDto: ResendDto,
    @IsMobileDevice() isMobile: boolean,
  ) {
    return this.authService.resendCode(resendDto, isMobile);
  }

  @ApiBody({ type: ResetDto })
  @Post('resetPassword')
  @HttpCode(200)
  public async resetPass(@Body() resetDto: ResetDto) {
    return this.authService.resetPassSendMail(resetDto);
  }

  @Post('resetPassword/confirm')
  @HttpCode(200)
  public async resetPassConfirm(
    @Body() resetDto: ResetConfirmDto,
    @IsMobileDevice() isMobile: boolean,
  ) {
    return this.authService.resetPassConfirm(resetDto, isMobile);
  }

  @Post('password/change')
  @HttpCode(200)
  public async changePass(
    @Body() resetDto: ChangePassDto,
    @IsMobileDevice() isMobile: boolean,
  ) {
    return this.authService.changePass(resetDto, isMobile);
  }

  @Get('apple/login')
  @UseGuards(AuthGuard('apple'))
  public async appleAuth(@Req() req: any, @Res() res) {
    // const apple_login = await this.authService.appleSignIn()
    // res.redirect(apple_login)
  }

  @Post('apple/callback')
  public async appleAuthRedirect(@Query('code') code: any, @Res() res) {
    console.log('Code: ', code);
    const result = await this.authService.appleCallBack(code);
    console.log('controller res: ', result);
    //res.redirect(`${configuration().redirectURL}/?token=${result.accessToken}&action=${result.action}&social=apple`)
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  public async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public async googleAuthRedirect(
    @Req() googleDto: GoogleDto,
    @Res() res,
    @IsMobileDevice() isMobile: boolean,
  ) {
    const result = await this.authService.authExternalUser(
      googleDto.user,
      isMobile,
    );

    const state = googleDto.query?.state;

    const { from } = state && decodeState(state);

    const isValidDomain =
      from && new URL(from).host === new URL(configuration().redirectURL).host;

    res.redirect(
      `${configuration().redirectURL}/?token=${result.accessToken}&action=${
        result.action
      }&social=google${isValidDomain ? `&goto=${from}` : ''}`,
    );
  }

  @Get('facebook/login')
  @UseGuards(AuthGuard('facebook'))
  public async facebookAuth(@Req() req: any) {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  public async facebookAuthRedirect(
    @Req() facebookDto: FacebookDto,
    @Res() res,
    @IsMobileDevice() isMobile: boolean,
  ) {
    const result = await this.authService.authExternalUser(
      facebookDto.user.user,
      isMobile,
    );
    res.redirect(
      `${configuration().redirectURL}/?token=${result.accessToken}&action=${
        result.action
      }&social=facebook`,
    );
  }
}
