import { Injectable } from '@nestjs/common';
import { RegisterViewModel } from '@pcpartdb/shared';
import { Context } from '../../shared/context';
import { UserService } from '../../user/user.service';

@Injectable()
export class RegisterViewModelService {
  constructor(private userService: UserService) {}

  async viewModel(ctx: Context) {
    const totalUsers = await this.userService.count(ctx);
    return { totalUsers } as RegisterViewModel;
  }
}
