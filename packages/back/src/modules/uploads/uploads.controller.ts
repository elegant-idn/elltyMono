import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { Get, Query, Delete, Patch } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { userInfo } from 'os';
import * as path from 'path';
import { configuration } from '../../config/configuration';
import { User } from '../../decorators/user.decorator';
import { UserDocument } from '../../schemas/user.schema';
import { removeUploaded } from '../../utils/helper';
import { CreateDto } from './dto/create.dto';
import { GetDto } from './dto/get.dto';
import { BulkDeleteDto } from './dto/deleteBulk.dto';
import { UploadsService } from './services/uploads.service';
import { PatchDto } from './dto/patch.dto';
import { ObjectIdDto } from './dto/objectId.dto';
import { TrashPatchDto } from './dto/trashPatch.dto';

const multerOptions: MulterOptions = {
  dest: path.resolve(__dirname, '', 'static'),
  limits: { fileSize: configuration().maxUploadsSize },
};

@ApiTags('uploads')
@Controller('uploads')
export class UploadsController {
  constructor(readonly uploadsService: UploadsService) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getAll(@Query() getDto: GetDto, @User() user: UserDocument) {
    return this.uploadsService.getAll(getDto, user);
  }

  @Get('/trash')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getTrash(@Query() getDto: GetDto, @User() user: UserDocument) {
    return this.uploadsService.getTrash(getDto, user);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 2 }], multerOptions),
  )
  async create(
    @User() user,
    @Body() createDto: CreateDto,
    @UploadedFiles()
    files: { images: Express.Multer.File[] },
  ) {
    return this.uploadsService
      .create(createDto, files.images, user)
      .finally(removeUploaded([...files.images]));
  }

  @Get('storage/meta')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async storageMeta(@User() user) {
    return this.uploadsService.getUserStorageMeta(user);
  }

  @Delete('bulk')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async deleteBulk(@User() user, @Body() deleteDto: BulkDeleteDto) {
    return this.uploadsService.deleteBulk(user, deleteDto);
  }

  @Patch('/trash')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async moveToTrash(@User() user, @Body() trashPatchDto: TrashPatchDto) {
    return this.uploadsService.moveToTrash(user, trashPatchDto);
  }

  @Patch('/restore')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async restore(@User() user, @Body() trashPatchDto: TrashPatchDto) {
    return this.uploadsService.restore(user, trashPatchDto);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async patch(
    @User() user,
    @Body() patchDtoArg: PatchDto,
    @Param() idDto: ObjectIdDto,
  ) {
    return this.uploadsService.patch(idDto.id, user, patchDtoArg);
  }
}
