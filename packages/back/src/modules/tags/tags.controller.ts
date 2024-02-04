import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../rbac/role.enum';
import RoleGuard from '../rbac/roles.guard';
import { CreateTag } from '../templates/dto/create-additions.dto';
import { ObjectIdDto } from '../templates/dto/objectId.dto';
import { GetSingleByValueDto } from './dto/getSingleByValue.dto';
import { TagsService } from './services/tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('')
  async getTags() {
    return this.tagsService.getTags();
  }

  @Get('/single/:value')
  async getTagByValue(@Param() dto: GetSingleByValueDto) {
    return this.tagsService.getTagByValue(dto);
  }

  @Post('create')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async CreateTag(@Body() createTag: CreateTag) {
    return this.tagsService.CreateTag(createTag);
  }

  @Delete(':id')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async DeleteTag(@Param() deleteTag: ObjectIdDto) {
    return this.tagsService.DeleteTag(deleteTag);
  }
}
