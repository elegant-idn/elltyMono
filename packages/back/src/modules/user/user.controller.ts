import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { Role } from '../rbac/role.enum';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from '../rbac/roles.guard';
import { ChangePermissionDto } from './dto/changePermission.dto';
import { DeleteOneDto } from '../templates/dto/deleteOne.dto';
import { ResetDto } from '../auth/dto/reset.dto';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { EditUserDto } from './dto/editUser.dto';
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../schemas/user.schema';
import { UpdateEmailDto, UpdatePassDto } from './dto/UpdatePass.dto';
import { ObjectIdDto } from '../templates/dto/objectId.dto';
import { configuration } from '../../config/configuration';
import { removeUploaded } from '../../utils/helper';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getAll() {
    return this.userService.getAll();
  }

  @Patch('edit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async editUser(@User() user, @Body() editUser: EditUserDto) {
    return this.userService.editUser(user, editUser);
  }

  @Post('cancel-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async cancelSubscription(@User() user) {
    return this.userService.cancelSubscription(user);
  }

  @Post('avatar')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      dest: path.resolve(__dirname, '', 'static'),
      limits: { fileSize: configuration().maxImageSize },
    }),
  )
  async setAvatar(@User() user, @UploadedFile() avatar: Express.Multer.File) {
    return await this.userService
      .setAvatar(user, avatar)
      .finally(removeUploaded([avatar]));
  }

  @Patch('set/designer')
  @ApiBody({ type: ChangePermissionDto })
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async setDesigner(@Body() setDesignerDto: ChangePermissionDto) {
    return await this.userService.setDesigner(setDesignerDto);
  }

  @Patch('set/admin')
  @ApiBody({ type: ChangePermissionDto })
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async setAdmin(@Body() setAdminDto: ChangePermissionDto) {
    return await this.userService.setAdmin(setAdminDto);
  }

  @Patch('unset/admin')
  @ApiBody({ type: ChangePermissionDto })
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async unsetAdmin(@Body() unsetAdminDto: ChangePermissionDto) {
    return await this.userService.unsetAdmin(unsetAdminDto);
  }

  @Patch('unset/designer')
  @ApiBody({ type: ChangePermissionDto })
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async unsetDesigner(@Body() unsetDesignerDto: ChangePermissionDto) {
    return await this.userService.unsetDesigner(unsetDesignerDto);
  }

  @Patch('upgrade')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async upgrade(@Req() req: Request) {
    return await this.userService.updateToPro(req);
  }

  @Get('download')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async canDownload(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.checkCanDownload(req, res);
  }

  @Get('payment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getPaymentMethod(@User() user: UserDocument) {
    return await this.userService.getPaymentMethod(user);
  }

  @Patch('update/pass')
  @ApiBody({ type: UpdatePassDto })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async updatePass(
    @User() user: UserDocument,
    @Body() updatePass: UpdatePassDto,
  ) {
    return this.userService.updatePass(user, updatePass);
  }

  @Patch('update/email')
  @ApiBody({ type: UpdateEmailDto })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async updateEmail(
    @User() user: UserDocument,
    @Body() updateEmail: UpdateEmailDto,
  ) {
    return this.userService.updateEmail(user, updateEmail);
  }

  @Get('update/email/:token')
  async confirmNewEmail(
    @Param('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.confirmNewEmail(token, res);
  }

  @ApiBody({ type: ObjectIdDto })
  @Patch('favorite')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async toggleFavoriteTemplate(
    @Body() templateId: ObjectIdDto,
    @User() user: UserDocument,
  ) {
    return await this.userService.toggleFavoriteTemplate(user, templateId);
  }

  // @Get('favorite')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  // async GetFavoriteTemplates(@User() user: UserDocument) {
  //   return await this.userService.GetFavoriteTemplates(user);
  // }

  @ApiBody({ type: ObjectIdDto })
  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async deleteUser(
    @Body() deleteUserDto: ObjectIdDto,
    @User() user: UserDocument,
  ) {
    return await this.userService.deleteUser(deleteUserDto, user);
  }

  @Patch('restore')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async restoreUser(@User() user: UserDocument) {
    return await this.userService.restoreUser(user);
  }
}
