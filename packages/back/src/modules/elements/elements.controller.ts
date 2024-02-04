import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ElementsService } from './services/elements.service';
import { FilterDto } from './dto/filter.dto';
import { ObjectIdDto, ObjectIdsDto } from '../templates/dto/objectId.dto';
import RoleGuard from '../rbac/roles.guard';
import { Role } from '../rbac/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { configuration } from '../../config/configuration';
import * as path from 'path';
import { UpdateElementDto } from './dto/update-element.dto';
import { CreateElementDto } from './dto/create-element.dto';
import { removeUploaded } from '../../utils/helper'

const multerOptions = {
    dest: path.resolve(__dirname, '', 'static'),
    limits: { fileSize: configuration().maxImageSize }
  }

@Controller('elements')
@ApiTags('Elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Get('')
  async all(@Query() getAllDto: FilterDto) {
    return this.elementsService.getAll(getAllDto);
  }

  @Get('amount')
  async getAmountTemplates() {
    return this.elementsService.getAmountElements();
  }

  @Get('single/:id')
  async findOne(@Param() getTemplateDto: ObjectIdDto) {
    return this.elementsService.findOne(getTemplateDto);
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
        data: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'data', maxCount: 1 }], multerOptions),
  )
  async edit(
    @Param() id: ObjectIdDto,
    @Body() editDto: UpdateElementDto,
    @UploadedFiles() files: { data: Express.Multer.File[] } | undefined | null,
  ) {
    return this.elementsService
      .edit(id, editDto, files)
      .finally(removeUploaded(files?.data));
  }

  @Post('create')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'data', maxCount: 1 }], multerOptions),
  )
  async create(
    @Body() createDto: CreateElementDto,
    @UploadedFiles() files: { data: Express.Multer.File[] },
  ) {
    return this.elementsService
      .create(createDto, files)
      .finally(removeUploaded(files?.data));
  }

  @Delete('delete')
  @UseGuards(RoleGuard([Role.Admin]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: ObjectIdsDto })
  async deleteSome(@Body() body: ObjectIdsDto) {
    return this.elementsService.deleteSome(body);
  }
}
