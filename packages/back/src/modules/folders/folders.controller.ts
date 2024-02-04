import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get, Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoldersService } from './services/folders.service';
import { CreateFolderDto } from './dto/createFolder.dto';
import { DeleteFolderDto } from './dto/deleteFolder.dto';
import {User} from "../../decorators/user.decorator";


@ApiTags('folders')
@Controller('folders')
export class FoldersController {
  constructor(readonly foldersService: FoldersService) {}
  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getAll(@User() user) {
    return this.foldersService.getAll(user);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async create(@Body() createDto: CreateFolderDto, @User() user) {
    return this.foldersService.create(createDto.name, user);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async delete(@Query() deleteDto: DeleteFolderDto, @User() user) {
    return this.foldersService.delete(deleteDto, user);
  }
}
