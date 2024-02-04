import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';
import { UserTemplatesModule } from '../user-templates/user-templates.module';

@Module({
  imports: [UserModule, UserTemplatesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
