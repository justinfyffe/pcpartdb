import { Injectable } from '@nestjs/common';
import { AdminEditUserViewModel } from '@pcpartdb/shared/view-models';
import { UserService } from 'packages/api/src/user/user.service';
import { Context } from '../../../shared/context';

@Injectable()
export class AdminEditUserViewModelService {
  constructor(private userService: UserService) {}

  async viewModel(userId: number, ctx: Context) {
    return { user: await this.getUser(userId, ctx) } as AdminEditUserViewModel;
  }

  private async getUser(id: number, ctx: Context) {
    return await this.userService.get(id, ctx);
  }
}
