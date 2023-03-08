import { Controller, Get } from '@nestjs/common';
import { Context, Ctx } from '../shared/context';

@Controller('config')
export class ConfigController {
  @Get()
  async getConfig(@Ctx() ctx: Context) {
    return ctx.config ?? {};
  }
}
