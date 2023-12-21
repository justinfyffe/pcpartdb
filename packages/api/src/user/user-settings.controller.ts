import { Body, Controller, Post } from '@nestjs/common';
import { UpdateUserSettingsRequest } from '@pcpartdb/shared';
import { Context, Ctx } from '../shared/context';
import { UserSettingsService } from './user-settings.service';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private service: UserSettingsService) {}

  @Post()
  async updateUserSettings(
    @Body() request: UpdateUserSettingsRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.service.updateUserSettings(request, ctx);
  }
}
