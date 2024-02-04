import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  User,
  UserDocument,
  UserPlan,
  UserStatus,
} from '../../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import { clearUserDto } from '../utils/clearUserDto';
import { ChangePermissionDto } from '../dto/changePermission.dto';
import { Role } from '../../rbac/role.enum';
import { UserDto } from '../../auth/dto/google.dto';
import { JwtService } from '@nestjs/jwt';
import { EditUserDto } from '../dto/editUser.dto';
import { constants } from '../utils/constants';
import { UpdateEmailDto, UpdatePassDto } from '../dto/UpdatePass.dto';
import { MailService } from '../../mail/services/mail.service';
import {
  ChangeEmail,
  ChangeEmailDocument,
} from '../../../schemas/changeEmail.schema';
import { configuration } from '../../../config/configuration';
import { ObjectIdDto } from '../../templates/dto/objectId.dto';
import { Template, TemplateDocument } from '../../../schemas/template.schema';
import { Payment, PaymentDocument } from '../../../schemas/payment.schema';
import { MailchimpService } from 'src/utils/mailchimp.service';
import * as graphics from '../../../utils/graphics';
import * as s3 from '../../../vendor/s3';
import { errHandler, generateFileName, pipeAsync } from '../../../utils/helper';
import { isExists, readStream } from '../../../utils/localstorage';
import {
  YookassaSubscription,
  YookassaSubscriptionDocument,
} from '../../../schemas/yookassa-subscription.schema';
import { isDisposableEmail } from '../../auth/utils/isDisposableEmail';
import { YookassaPayService } from '../../yookassa-pay/yookassa-pay.service';
import { SendyService } from '../../../utils/sendy.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ChangeEmail.name)
    private changeEmailModel: Model<ChangeEmailDocument>,
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(YookassaSubscription.name)
    private yookassaSubscriptionModel: Model<YookassaSubscriptionDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
    private mailchimpService: MailchimpService,
    private yookassService: YookassaPayService,
    private sendyService: SendyService,
  ) {}

  async create(createUserDto): Promise<User> {
    const hashedPass = await hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      hash: hashedPass,
    });
    return createdUser.save();
  }

  async updatePass(user: UserDocument, updatePassDto: UpdatePassDto) {
    const comparePass = await compare(updatePassDto.currentPass, user.hash);
    if (!comparePass) {
      return new HttpException('wrong old password', HttpStatus.BAD_REQUEST);
    }

    user.hash = await hash(updatePassDto.newPass, 10);

    await user.save();

    return { success: true };
  }

  async cancelSubscription(user: UserDocument) {
    const subscriber = await this.yookassaSubscriptionModel.findOne({
      userId: user._id,
      status: 'active',
    });

    if (!subscriber) {
      await this.mailService.sendAdminCancellationEmail(user);
      await this.userModel.updateOne(
        { _id: user._id },
        { cancelSubscriptionDisabled: true },
      );
      return;
    }

    try {
      const yookassaResult = await this.yookassService.cancelSubscription(user);

      if (yookassaResult !== HttpStatus.OK) return;

      await this.mailService.sendYookassaWillCancelEmail(user, subscriber);
      await this.mailService.sendYookassaAdminCancellationEmail(
        user,
        subscriber,
      );
    } catch {
      await this.mailService.sendAdminCancellationEmail(user);
    }

    return { success: true };
  }

  async updateEmail(user: UserDocument, updateEmailDto: UpdateEmailDto) {
    try {
      const existingUser = await this.findUserByEmail(updateEmailDto.email);
      const reservedEmail = await this.changeEmailModel
        .findOne({ email: updateEmailDto.email.toLocaleLowerCase() })
        .exec();

      if (existingUser || reservedEmail) {
        return new HttpException(
          'this email already exist in system, if it yours try to reset password',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(await compare(updateEmailDto.password, user.hash))) {
        throw new HttpException(
          'Incorrect password',
          HttpStatus.METHOD_NOT_ALLOWED,
        );
      }

      const emailToken = (
        Math.floor(Math.random() * 9000000) + 1000000
      ).toString();

      await this.changeEmailModel.create({
        emailToken,
        email: updateEmailDto.email.toLowerCase(),
        userId: user._id,
      });

      await this.mailService.sendEmailUpdate(
        updateEmailDto.email,
        emailToken,
        user,
      );
    } catch (e) {
      return e;
    }
  }

  async confirmNewEmail(token: string, res: Response) {
    const changeEmail = await this.changeEmailModel
      .findOne({ emailToken: token })
      .exec();
    if (!changeEmail) {
      return new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel
      .findOneAndUpdate(
        { _id: changeEmail.userId },
        {
          email: changeEmail.email,
        },
      )
      .exec();

    await this.yookassaSubscriptionModel.findOneAndUpdate(
      { userId: changeEmail.userId },
      {
        email: changeEmail.email,
      },
    );

    await changeEmail.delete();

    res.redirect(configuration().redirectURL);
  }

  async editUser(userDoc: UserDocument, editUser: EditUserDto) {
    const user = await this.userModel.findOne({ _id: userDoc._id }).exec();
    if (!user) {
      return new HttpException(
        'failed to verify Token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (editUser.firstName) {
      user.firstName = editUser.firstName;
    }

    if (editUser.lastName) {
      user.lastName = editUser.lastName;
    }

    // if (editUser.language) {
    //   user.language = editUser.language;
    // await this.mailchimpService.updateUserLanguage(
    //   configuration().mailchimp.all_customers,
    //   user.email,
    //   editUser.language,
    // );
    // }

    await user.save();

    return {
      fistName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
  }

  async setAvatar(userDoc: UserDocument, avatar: Express.Multer.File) {
    const user = await this.userModel.findOne({ _id: userDoc._id }).exec();
    if (!user) {
      return new HttpException(
        'failed to verify Token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (avatar) {
      const source = await readStream(avatar.path);

      if (!source) {
        throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
      }

      const targetName = generateFileName(avatar.originalname);

      const resize = await graphics
        .resizeStream(300, 'jpg')
        .catch(errHandler('avatar not scaled'));

      const uploader = s3.pushStream({
        folder: 'avatars',
        key: targetName,
        mimeType: 'image/jpeg',
      });

      const [uploaded] = await Promise.all([
        uploader.upload,
        pipeAsync(source, resize, uploader.dest),
      ]).catch(errHandler('avatar not uploaded'));

      await this.userModel
        .updateOne({ _id: userDoc._id }, { avatar: uploaded.Location })
        .exec();

      if (user.avatar !== constants.DEFAULT_USER_AVATAR) {
        await s3
          .drop(s3.decodePublicUrl(user.avatar))
          .catch((e) => console.error(e));
      }

      return { avatarLink: uploaded.Location };
    }
    await user.save();
    return { avatarLink: user.avatar };
  }

  async deleteAvatarAndSetDefault(user: UserDocument) {
    if (user.avatar !== constants.DEFAULT_USER_AVATAR) {
      await s3
        .drop(s3.decodePublicUrl(user.avatar))
        .catch((e) => console.error(e));

      user.avatar = constants.DEFAULT_USER_AVATAR;
      await user.save();
    }

    return true;
  }

  async createGoogle({ email }: UserDto): Promise<User> {
    const createdUser = new this.userModel({
      email,
      firstName: email.split('@')[0],
      status: UserStatus.active,
    });
    return createdUser.save();
  }

  async resetPassConfirm({ email }) {
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $set: { status: UserStatus.reset } },
        { new: true },
      )
      .exec();
  }

  async saveResetPassCode({ email, code }) {
    return this.userModel.updateOne({ email }, { $set: { resetCode: code } });
  }

  async changePass({ email, password }) {
    const hashedPass = await hash(password, 10);
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $set: { status: UserStatus.active, hash: hashedPass } },
        { new: true },
      )
      .exec();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findUser({ uuid }): Promise<User> {
    return this.userModel.findOne({ uuid }).exec();
  }

  async activateUser({ email }) {
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $set: { status: UserStatus.active } },
        { new: true },
      )
      .exec();
  }

  async updateToPro(req: Request) {
    const JWTtoken = req.headers.authorization.split(' ')[1];
    const { uuid } = this.jwtService.verify(JWTtoken);

    try {
      await this.userModel.updateOne(
        { uuid },
        { $set: { plan: UserPlan.pro, cancelSubscriptionDisabled: false } },
      );

      const user = await this.userModel.findOne({ uuid });

      await this.sendyService.unsubscribe(
        user.email,
        this.sendyService.getListId('payment-failed', user.language),
      );

      return {
        plan: UserPlan.pro,
        success: true,
      };
    } catch (e) {
      return e;
    }
  }

  async checkCanDownload(req: Request, res: Response) {
    const JWTtoken = req.headers.authorization.split(' ')[1];
    const { uuid } = this.jwtService.verify(JWTtoken);

    // console.log(uuid)

    const user = await this.userModel.findOne({ uuid }).exec();
    const { downloadsCounter, plan } = user;
    // console.log(user)
    if (plan === UserPlan.pro) {
      // console.log(plan)
      return {
        canDownload: true,
      };
      //res.json({canDownload: true})
    }

    if (downloadsCounter > 0) {
      await this.userModel.updateOne(
        { uuid },
        { $set: { downloadsCounter: downloadsCounter - 1 } },
      );

      const expiresIn = Date.now() + 24 * 3600 * 1000 * 30;
      const accessToken = this.jwtService.sign({ uuid });

      const dataToCookie = {
        username: user.firstName,
        email: user.email,
        status: user.status,
        remainingDownloads: user.downloadsCounter - 1,
        plan: user.plan,
        role: user.role,
        accessToken,
        expiresIn,
      };
      //res.cookie("auth", dataToCookie, {httpOnly: true, expires: new Date(expiresIn)})

      return {
        canDownload: true,
        downloadsLeft: downloadsCounter - 1,
      };
    }

    return {
      canDownload: false,
    };
  }

  async getAll() {
    return (await this.userModel.find().exec()).map((item) =>
      clearUserDto(item),
    );
  }

  async getPaymentMethod(user: UserDocument) {
    if (user.plan === UserPlan.pro) {
      const activePayment = await this.paymentModel
        .findOne({ userId: user._id, status: 'active' })
        .exec();
      return { paymentType: activePayment.paymentType };
    }
  }

  async blockUser({ email }) {
    return this.userModel.updateOne(
      { email },
      { $set: { status: UserStatus.blocked } },
    );
  }

  async setAdmin({ uuid }: ChangePermissionDto) {
    return this.userModel
      .updateOne({ uuid }, { $set: { role: Role.Admin } })
      .exec();
  }

  async setDesigner({ uuid }: ChangePermissionDto) {
    return this.userModel
      .updateOne({ uuid }, { $set: { role: Role.Designer } })
      .exec();
  }

  async unsetAdmin({ uuid }: ChangePermissionDto) {
    return this.userModel
      .updateOne({ uuid }, { $set: { role: Role.User } })
      .exec();
  }

  async unsetDesigner({ uuid }: ChangePermissionDto) {
    return this.userModel
      .updateOne({ uuid }, { $set: { role: Role.User } })
      .exec();
  }

  async toggleFavoriteTemplate(user: UserDocument, { id }: ObjectIdDto) {
    const template = await this.templateModel.findOne({ _id: id }).exec();
    if (!template) {
      throw new HttpException(
        "can't find this template",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const userFavorites = await this.userModel
      .findOne({ _id: user._id, favorites: { $in: [template._id] } })
      .exec();

    if (userFavorites) {
      await this.userModel
        .findOneAndUpdate(
          { _id: user._id },
          { $pullAll: { favorites: [template._id] } },
        )
        .exec();
    } else {
      await this.userModel
        .findOneAndUpdate(
          { _id: user._id },
          { $push: { favorites: template._id } },
        )
        .exec();
    }
  }

  private EXCLUDE_TRUSTED_EMAILS_REGEXP = /^(?!.*@(gmail.com|mail.ru)).*$/;

  async getDisposableUsers() {
    const usersWithUntrustedEmailDomains = await this.userModel.find(
      {
        email: { $regex: this.EXCLUDE_TRUSTED_EMAILS_REGEXP },
      },
      { hash: 0, confirmationCode: 0, resetCode: 0 },
    );

    return usersWithUntrustedEmailDomains.filter((user, index) => {
      console.log(
        `Verifying: ${index + 1}/${usersWithUntrustedEmailDomains.length}`,
      );
      return isDisposableEmail(user.email);
    });
  }
  async deleteDisposableUsers() {
    const usersWithDisposableEmails = await this.getDisposableUsers();

    const userIdsWithDisposableEmails = usersWithDisposableEmails.map(
      (user) => user.id,
    );

    await this.userModel.deleteMany({
      _id: { $in: userIdsWithDisposableEmails },
    });

    return usersWithDisposableEmails;
  }

  // async GetFavoriteTemplates(user: UserDocument) {
  //     const userWithFavorites = await this.userModel.findOne({_id: user._id}).populate({
  //         path: 'favorites',
  //         model: Template,
  //         populate: {
  //             path: 'colors tags categories',
  //         }
  //     }).exec()

  //     return {
  //         favorites: userWithFavorites.favorites
  //     }
  // }

  async deleteUser(deleteUserDto: ObjectIdDto, user: UserDocument) {
    if (JSON.stringify(user._id) !== JSON.stringify(deleteUserDto.id)) {
      throw new HttpException(
        'you can not delete account of another user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const restoreTime = +new Date() + 24 * 3600 * 1000 * 14;

    user.status = UserStatus.deleted;
    user.restoreTime = restoreTime;
    await user.save();
    return { success: true };
  }

  async restoreUser(user: UserDocument) {
    if (user.status !== UserStatus.deleted) {
      throw new HttpException(
        'this user not deleted',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    user.status = UserStatus.active;
    user.restoreTime = null;
    await user.save();
    return { success: true };
  }
}
