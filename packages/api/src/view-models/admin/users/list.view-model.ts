import { Injectable } from '@nestjs/common';
import { AdminListUsersViewModel } from '@pcpartdb/shared';
import { UserService } from 'packages/api/src/user/user.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminListUsersViewModelService {
  constructor(private userService: UserService) {}

  async viewModel(ctx: Context) {
    return {
      users: await this.getUsers(ctx),
    } as AdminListUsersViewModel;
  }

  private async getUsers(ctx: Context) {
    return await this.userService.list(ctx);
  }
}
