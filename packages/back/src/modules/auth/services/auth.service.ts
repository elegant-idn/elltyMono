import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { configuration } from '../../../config/configuration';
import { User, UserDocument, UserStatus } from '../../../schemas/user.schema';
import { generateConfirmationCode } from '../../../utils/random';
import { MailService } from '../../mail/services/mail.service';
import { Role } from '../../rbac/role.enum';
import { UserService } from '../../user/services/user.service';
import { ChangePassDto } from '../dto/changePassDto';
import { ConfirmMailDto } from '../dto/confirmMail.dto';
import { UserDto } from '../dto/google.dto';
import { QueryTypes, ResendDto } from '../dto/resend.dto';
import { ResetConfirmDto, ResetDto } from '../dto/reset.dto';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
import { JwtPayload } from '../interface/jwtPayload';

const axios = require('axios');

import { InjectModel } from '@nestjs/mongoose';
import {
  getAuthorizationToken,
  getAuthorizationUrl,
  getClientSecret,
  verifyIdToken,
} from 'apple-signin-auth';
import { Model, Types } from 'mongoose';
import { SendyService } from 'src/utils/sendy.service';
import {
  YookassaSubscription,
  YookassaSubscriptionDocument,
} from '../../../schemas/yookassa-subscription.schema';
import { MailchimpService } from '../../../utils/mailchimp.service';
import { UserTemplatesService } from '../../user-templates/services/user-templates.service';
import { clearUserDto } from '../../user/utils/clearUserDto';
import { isDisposableEmail } from '../utils/isDisposableEmail';
import { Token, TokenDocument } from '../../../schemas/token.schema';
import { TokenType } from '../../../schemas/token.schema';
import { isMobilePhone } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private sendyService: SendyService,
    private mailchimpService: MailchimpService,
    private userTemplatesService: UserTemplatesService,
    @InjectModel(YookassaSubscription.name)
    private yookassaSubscriptionModel: Model<YookassaSubscriptionDocument>,
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  async validateUser({ uuid }: JwtPayload): Promise<Partial<User> | null> {
    const user = await this.userService.findUser({ uuid });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (user.status === UserStatus.blocked) {
      throw new UnauthorizedException('Your account been blocked');
    }

    if (user.status === UserStatus.notActive) {
      throw new UnauthorizedException('Please activate your account first');
    }

    return user;
  }

  // async login(signInDto: SignInDto) {
  //   return this.signIn(signInDto, true);
  // }

  async appleSignIn() {
    const apple_login = getAuthorizationUrl({
      clientID: configuration().apple.client_id,
      redirectUri: configuration().apple.redirect_uri,
      responseMode: 'form_post',
      scope: 'email',
    });
    return apple_login;
  }

  async appleCallBack(code: any) {
    const clientSecret = getClientSecret({
      clientID: configuration().apple.client_id,
      teamID: configuration().apple.team_id,
      privateKeyPath: configuration().apple.key_path,
      keyIdentifier: configuration().apple.key_id,
    });
    console.log('Jwt: ', clientSecret);

    const options = {
      clientID: configuration().apple.client_id,
      redirectUri: configuration().apple.redirect_uri,
      clientSecret: clientSecret,
    };

    try {
      console.log('Code: ', code);
      const tokenResponse = await getAuthorizationToken(code, {
        clientID: options.clientID,
        redirectUri: options.redirectUri,
        clientSecret: clientSecret,
      });
      console.log('Token resp: ', tokenResponse);
      const { sub: userAppleId } = await verifyIdToken(tokenResponse.id_token);
      console.log('userAppleId: ', userAppleId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async signIn(
    signInDto: SignInDto,
    res: Response,
    req: Request,
    isAdm = false,
    isMobile = false,
  ) {
    const user = (await this.userService.findUserByEmail(
      signInDto.email,
    )) as UserDocument;

    if (!user || (isAdm && ![Role.Admin, Role.Designer].includes(user.role))) {
      return new HttpException(
        'Invalid email or password',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!(await compare(signInDto.password, user.hash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (signInDto.temporaryUserToken) {
      await this.userTemplatesService.assignTemplatesToUserByTemporaryToken(
        signInDto.temporaryUserToken,
        user,
      );
    }

    const token = await this._createToken(user, isMobile);

    const returnUser = {
      email: user.email,
      status: user.status,
      first_name: user.firstName,
      last_name: user.lastName,
      full_name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      remainingDownloads: user.downloadsCounter,
      plan: user.plan,
      avatar: user.avatar,
      ...token,
    };

    // const valueCookie = JSON.stringify(returnUser)
    // console.log(req.cookies)
    // res.cookie("user", valueCookie, {httpOnly: true, expires: new Date(token.expiresIn)})

    return returnUser;
  }

  async signUp(signUpDto: SignUpDto, res: Response, req: Request) {
    if (isDisposableEmail(signUpDto.email)) {
      return new HttpException('Not a valid email', HttpStatus.NOT_ACCEPTABLE);
    }

    const candidate = await this.userService.findUserByEmail(signUpDto.email);
    if (candidate && candidate.status === UserStatus.notActive) {
      await this.mailService.sendUserConfirmation(
        candidate,
        candidate.confirmationCode,
      );
      // await this.mailchimpService.addUserToList(
      //   configuration().mailchimp.all_customers,
      //   signUpDto.email,
      //   signUpDto.language,
      // );
      if (signUpDto.temporaryUserToken) {
        await this.userTemplatesService.assignTemplatesToUserByTemporaryToken(
          signUpDto.temporaryUserToken,
          candidate as UserDocument,
        );
      }

      const returnUser = {
        first_name: candidate.firstName,
        last_name: candidate.lastName,
        full_name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        status: candidate.status,
      };
      return returnUser;
    }
    const confirmationCode = generateConfirmationCode();
    let user;

    try {
      user = await this.userService.create({
        ...signUpDto,
        email: signUpDto.email.toLocaleLowerCase(),
        confirmationCode: confirmationCode,
      });
    } catch (e) {
      return new HttpException('Email already confirmed', HttpStatus.CONFLICT);
    }

    if (signUpDto.temporaryUserToken && user) {
      await this.userTemplatesService.assignTemplatesToUserByTemporaryToken(
        signUpDto.temporaryUserToken,
        user,
      );
    }

    const newUser = {
      first_name: user.firstName,
      last_name: user.lastName,
      full_name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      status: user.status,
    };

    await this.mailService.sendUserConfirmation(user, confirmationCode);
    // await this.mailService.sendInfoAboutNewUser(user);
    // await this.sendyService.subscribe(user.email, user.language);
    // await this.mailchimpService.addUserToList(
    //   configuration().mailchimp.all_customers,
    //   signUpDto.email,
    //   signUpDto.language,
    // );

    return newUser;
  }

  async logout(res: Response) {
    res.clearCookie('user');
    return {
      success: true,
    };
  }

  async resetPassSendMail({ email }: ResetDto) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return new UnauthorizedException("User doesn't exists");
    }

    const confirmationCode = generateConfirmationCode();
    await this.mailService.sendUserResetPassword(user, confirmationCode);
    await this.userService.saveResetPassCode({
      email: user.email,
      code: confirmationCode,
    });

    return {
      success: true,
    };
  }

  async resetPassConfirm({ email, code }: ResetConfirmDto, isMobile = false) {
    const user = await this.userService.findUserByEmail(email);

    if (user.resetCode !== code) {
      return new HttpException(
        "Failed code validation, you can't reset password",
        HttpStatus.BAD_REQUEST,
      );
    }

    const res = await this.userService.resetPassConfirm({ email: user.email });

    const jwtToken = await this._createToken(res, isMobile);

    return {
      username: res.firstName,
      email: res.email,
      status: res.status,
      ...jwtToken,
    };
  }

  async confirmMail({ email, code }: ConfirmMailDto, isMobile = false) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException("User doesn't exists");
    }

    if (user.confirmationCode === code) {
      const res = await this.userService.activateUser({ email });
      const JWTtoken = await this._createToken(res, isMobile);
      await this.sendyService.subscribe(
        user.email,
        user.language,
        user.firstName,
      );

      return {
        email: res.email,
        status: res.status,
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
        remainingDownloads: user.downloadsCounter,
        ...JWTtoken,
      };
    }

    return new HttpException(
      'Incorrect token for email',
      HttpStatus.BAD_REQUEST,
    );
  }

  async resendCode({ email, type }: ResendDto, isMobile = false) {
    const user = await this.userService.findUserByEmail(email);
    if (type === QueryTypes.confirm) {
      if (!user || user.status !== UserStatus.notActive) {
        return new HttpException(
          "User doesn't exists or already active",
          HttpStatus.CONFLICT,
        );
      }
      await this.mailService.sendUserConfirmation(user, user.confirmationCode);
    } else if (type === QueryTypes.reset) {
      if (!user) {
        return new HttpException("User doesn't exists", HttpStatus.CONFLICT);
      }
      await this.mailService.sendUserResetPassword(user, user.resetCode);
    } else {
      return new HttpException(
        'Something went wrong, please try again.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const token = await this._createToken(user, isMobile);

    return {
      username: user.firstName,
      email: user.email,
      status: user.status,
      ...token,
    };
  }

  async changePass({ email, password }: ChangePassDto, isMobile = false) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return new UnauthorizedException("User doesn't exists");
    }

    const res = await this.userService.changePass({
      email: user.email,
      password,
    });

    const jwtToken = await this._createToken(res, isMobile);

    return {
      username: res.firstName,
      email: res.email,
      status: res.status,
      ...jwtToken,
    };
  }

  async authExternalUser(user: UserDto, isMobile = false) {
    let currentUser = await this.userService.findUserByEmail(user.email);
    let action = 'login';
    if (!currentUser) {
      try {
        currentUser = await this.userService.createGoogle(user);
        // await this.mailchimpService.updateUserStatus(
        //   configuration().mailchimp.all_customers,
        //   currentUser.email,
        // );
        // await this.mailService.sendInfoAboutNewUser(currentUser);
        action = 'signup';
      } catch (e) {
        return new HttpException('Email already used', HttpStatus.OK);
      }
    }

    const jwtToken = await this._createToken(currentUser, isMobile);
    await this.sendyService.subscribe(
      currentUser.email,
      currentUser.language,
      currentUser.firstName,
    );

    return {
      first_name: currentUser.firstName,
      last_name: currentUser.lastName,
      full_name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      status: currentUser.status,
      action: action,
      ...jwtToken,
    };
  }

  async getCurrentUser(user: UserDocument) {
    const yookassaSubscription = await this.yookassaSubscriptionModel.findOne({
      userId: user._id,
      status: { $ne: 'canceled' },
    });

    return {
      ...clearUserDto(user),
      billingPeriod: yookassaSubscription?.plan,
      subscription: yookassaSubscription
        ? {
            paymentDue: yookassaSubscription?.paymentDue,
            status: yookassaSubscription?.status,
          }
        : null,
    };
  }

  private async _createToken(user_data: User, isMobile: boolean): Promise<any> {
    const user = { email: user_data.email, uuid: user_data.uuid };
    const accessToken = this.jwtService.sign(user, {
      expiresIn: configuration().expiresIn,
    });
    const dateNow = Date.now();
    const expiresIn = dateNow + 24 * 3600 * 1000 * 30;

    await this.createTokenDocument(
      user_data,
      accessToken,
      new Date(expiresIn),
      isMobile,
    );

    return {
      expiresIn: expiresIn,
      accessToken,
    };
  }

  private getTokenType = (isMobile: boolean) => {
    return isMobile ? TokenType.mobile : TokenType.desktop;
  };

  async createTokenDocument(
    user: Partial<UserDocument>,
    token: string,
    expiresAt: Date,
    isMobile = false,
  ) {
    const type = this.getTokenType(isMobile);

    const activeTokens = await this.tokenModel.find({
      user: user._id,
      blacklisted: false,
      type,
    });

    if (activeTokens.length !== 0) {
      await this.tokenModel.updateMany(
        {
          user: user._id,
          blacklisted: false,
          type,
        },
        { blacklisted: true },
      );
    }

    await this.tokenModel.create({
      user: user._id,

      token: token,
      expiresAt,

      type,
    });
  }

  async validTokenExists(
    user: Partial<UserDocument>,
    token: string,
    isMobile: boolean,
  ) {
    const type = this.getTokenType(isMobile);

    const tokenDoc = await this.tokenModel.findOne({
      user: user._id,
      token,
      blacklisted: false,
      type,
    });

    return !!tokenDoc;
  }
}
