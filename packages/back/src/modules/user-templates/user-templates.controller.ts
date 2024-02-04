import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { configuration } from '../../config/configuration';
import { User } from '../../decorators/user.decorator';
import { OptionalJwtAuthGuard } from '../../guards/OptionalAuthGuard';
import { PaginateDto } from '../../shared/paginate.dto';
import {
  editUserTemplateFileName,
  editUserTemplateFolderLatest,
  removeUploaded,
} from '../../utils/helper';
import { Role } from '../rbac/role.enum';
import RoleGuard from '../rbac/roles.guard';
import {
  AddPreviewUserTemplateDto,
  CreateUserTemplateDto,
  UpdateUserTemplateDto,
  UpdateUserTemplateTitleDto,
} from './dto';
import { CopyUserTemplateDto } from './dto/copy-user-template.dto';
import { MoveToTrashDTO } from './dto/move-to-trash.dto';
import { RestoreTrashDTO } from './dto/restore-trash.dto';
import { UserTemplatesService } from './services/user-templates.service';

@Controller('user/templates')
@ApiTags('User templates')
export class UserTemplatesController {
  constructor(private readonly userTemplatesService: UserTemplatesService) { }

  @Post('/create')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('template', {
      storage: diskStorage({
        destination: editUserTemplateFolderLatest,
        filename: editUserTemplateFileName,
      }),
    }),
  )
  async createUserTemplate(
    @User() user,
    @Body() uploadDto: CreateUserTemplateDto,
    @UploadedFile() template: Express.Multer.File,
  ) {
    return this.userTemplatesService
      .createUserTemplate(
        user,
        template,
        uploadDto.title,
        uploadDto.temporaryUserToken,
        uploadDto.categoryId,
        uploadDto.height,
        uploadDto.width,
      )
      .finally(removeUploaded([template]));
  }

  @Get('/trash')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  findTrash(@Query() paginate: PaginateDto, @User() user) {
    return this.userTemplatesService.findTrash(user, paginate);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getUserTemplate(@User() user, @Param('id') id: string, @Res() res) {
    return this.userTemplatesService.getUserTemplate(id, user, res);
  }

  @Get('non/:id')
  async getNonUserTemplate(
    @Param('id') id: string,
    @Query('user') user: string,
    @Res() res,
  ) {
    return this.userTemplatesService.getNonUserTemplate(id, user, res);
  }

  @Get('non/meta/:id')
  async getNonUserTemplateMeta(
    @Query('user') user: string,
    @Param('id') id: string,
  ) {
    return this.userTemplatesService.getNonUserTemplateMeta(id, user);
  }

  @Post('clone/:id')
  @UseGuards(AuthGuard('jwt'))
  async cloneUserTemplate(
    @User() user,
    @Param('id') userTemplateId: string,
    @Body() body: CopyUserTemplateDto,
  ) {
    return this.userTemplatesService.cloneUserTemplate(
      userTemplateId,
      user,
      body.title,
    );
  }

  @Get('meta/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getUserTemplateMeta(@User() user, @Param('id') id: string) {
    return this.userTemplatesService.getUserTemplateMeta(id, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  findAll(@Query() paginate: PaginateDto, @User() user) {
    return this.userTemplatesService.findAll(user, paginate);
  }

  @Get('folder/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  findOne(
    @Query() paginate: PaginateDto,
    @User() user,
    @Param('id') id: string,
  ) {
    return this.userTemplatesService.findByFolder(id, user, paginate);
  }

  @Post(':id/verification')
  @UseGuards(RoleGuard([Role.Designer, Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  sendVerification(@Param('id') id: string, @User() user) {
    return this.userTemplatesService.sendVerification(id, user);
  }

  @Patch('save/:id/:version')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('template', {
      storage: diskStorage({
        destination: editUserTemplateFolderLatest,
        filename: editUserTemplateFileName,
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Param('version') version: number,
    @UploadedFile() template,
    @Body() uploadDto: UpdateUserTemplateDto,
    @User() user,
  ) {
    return this.userTemplatesService
      .updateUserTemplate(
        user,
        id,
        version,
        template,
        uploadDto.temporaryUserToken,
        uploadDto.height,
        uploadDto.width,
      )
      .finally(removeUploaded([template]));
  }

  @Patch(':id/preview')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('preview', {
      dest: path.resolve(__dirname, '', 'static'),
      limits: { fileSize: configuration().maxImageSize },
    }),
  )
  updatePreview(
    @Param('id') id: string,
    @Body() addPreviewUserTemplateDto: AddPreviewUserTemplateDto,
    @UploadedFile() preview: Express.Multer.File,
    @User() user,
  ) {
    return this.userTemplatesService
      .updateUserTemplatePreview(
        user,
        id,
        preview,
        addPreviewUserTemplateDto.temporaryUserToken,
      )
      .finally(removeUploaded([preview]));
  }

  @Patch(':id/title')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  updateTitle(
    @Param('id') id: string,
    @Body() updateUserTemplateTitleDto: UpdateUserTemplateTitleDto,
    @User() user,
  ) {
    return this.userTemplatesService.updateUserTemplateTitle(
      user,
      id,
      updateUserTemplateTitleDto.title,
    );
  }

  @Patch(':id/trash')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  moveToTrash(@Param('id') id: string, @User() user) {
    return this.userTemplatesService.toTrash(id, user);
  }

  @Patch('/trash/bulk')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  moveToTrashBulk(@User() user, @Body() dto: MoveToTrashDTO) {
    return this.userTemplatesService.toTrash(dto.ids, user);
  }

  @Patch(':id/restore')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  restoreTrash(@Param('id') id: string, @User() user) {
    return this.userTemplatesService.restore(id, user);
  }

  @Patch('/restore/bulk')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  restoreTrashBulk(@User() user, @Body() dto: RestoreTrashDTO) {
    return this.userTemplatesService.restore(dto.ids, user);
  }

  @Patch(':id&:folder')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  refactorTemplateFolder(
    @Param('id') id: string,
    @Param('folder') folder: string,
    @User() user,
  ) {
    return this.userTemplatesService.refactorTemplateFolder(id, folder, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string, @User() user) {
    return this.userTemplatesService.remove(id, user);
  }
}
