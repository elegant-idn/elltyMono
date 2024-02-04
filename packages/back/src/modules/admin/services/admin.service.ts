import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { UserTemplatesService } from '../../user-templates/services/user-templates.service';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private userTemplatesService: UserTemplatesService,
  ) {}

  async deleteDisposableUsers() {
    const deletedUsers = await this.userService.deleteDisposableUsers();

    await Promise.allSettled(
      deletedUsers.map(async (userId, index) => {
        try {
          await this.userTemplatesService.deleteAllByUser(userId);
          console.log(
            `deleted templates for ${index + 1}/${deletedUsers.length}`,
          );
        } catch (e) {
          console.log('Error for ', userId);
        }
      }),
    );

    return deletedUsers.length;
  }

  async getDisposableUsers() {
    return await this.userService.getDisposableUsers();
  }
}
