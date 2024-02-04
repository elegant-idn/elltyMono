import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import {CreateCategory} from "../templates/dto/create-additions.dto";
import RoleGuard from "../rbac/roles.guard";
import {Role} from "../rbac/role.enum";
import {AuthGuard} from "@nestjs/passport";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {ObjectIdDto} from "../templates/dto/objectId.dto";

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('')
  async getCategories() {
      return this.categoriesService.getCategories();
  }

  @Post('/create')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async CreateCategory(@Body() createCategory: CreateCategory) {
      return this.categoriesService.CreateCategory(createCategory);
  }

  @Delete(':id')
  @UseGuards(RoleGuard([Role.Admin, Role.Designer]))
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async DeleteCategory(@Param() deleteCat: ObjectIdDto) {
      return this.categoriesService.DeleteCategory(deleteCat);
  }

}
