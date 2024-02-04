import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TemplatesService } from './services/templates.service';
import RoleGuard from '../rbac/roles.guard';
import { Role } from '../rbac/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { CreateDto, EditTemplateDto } from './dto/create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterDto } from './dto/filter.dto';
import * as path from 'path';
import { CreateTag, CreateCategory } from './dto/create-additions.dto';
import { ObjectIdDto, ObjectIdsDto } from './dto/objectId.dto';
import { configuration } from '../../config/configuration';
import { removeUploaded } from '../../utils/helper';

const multerOptions = {
  dest: path.resolve(__dirname, '', 'static'),
  limits: { fileSize: configuration().maxImageSize },
};

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(readonly templatesService: TemplatesService) {}

  @Get('')
  async all(@Query() getAllDto: FilterDto) {
    return this.templatesService.getAll(getAllDto);
  }

  @Get('amount')
  async getAmountTemplates() {
    return this.templatesService.getAmountTemplates();
  }

  @Get('single/:id')
  async findOne(@Param() getTemplateDto: ObjectIdDto) {
    return this.templatesService.findOne(getTemplateDto);
  }

  @Put('edit/:id')
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        categories: {
          type: 'string',
        },
        colors: {
          type: 'string',
        },
        tags: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
        width: {
          type: 'string',
        },
        height: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
        json: {
          type: 'string',
          format: 'binary',
        },
        languages: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'json', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async edit(
    @Param() id: ObjectIdDto,
    @Body() editDto: EditTemplateDto,
    @UploadedFiles()
    files:
      | { image: Express.Multer.File[]; json: Express.Multer.File[] }
      | undefined
      | null,
  ) {
    return this.templatesService
      .edit(id, editDto, files)
      .finally(
        removeUploaded([...(files?.image || []), ...(files?.json || [])]),
      );
  }

  @Post('create')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'json', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async create(
    @Body() createDto: CreateDto,
    @UploadedFiles()
    files: { image: Express.Multer.File[]; json: Express.Multer.File[] },
  ) {
    return this.templatesService
      .create(createDto, files)
      .finally(removeUploaded([...files.image, ...files.json]));
  }

  @Delete('delete')
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ObjectIdsDto })
  async deleteSome(@Body() body: ObjectIdsDto) {
    return this.templatesService.deleteSome(body);
  }
}
