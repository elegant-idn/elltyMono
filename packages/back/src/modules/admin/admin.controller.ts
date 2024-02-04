import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './services/admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(readonly adminService: AdminService) {}

  // @Delete('user/disposable')
  // @HttpCode(200)
  // async deleteUserDisposable() {
  //   await this.adminService.deleteDisposableUsers();
  // }

  // @Get('user/disposable')
  // @HttpCode(200)
  // async getUserDisposable() {
  //   return await this.adminService.getDisposableUsers();
  // }
}
