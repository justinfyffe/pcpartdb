import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AutomationStatus } from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private service: AutomationService, private db: Database) {}

  @Get('status')
  @UseGuards(StaffGuard)
  async getStatus(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.getStatus(ctx);
      },
      { ctx },
    );
  }

  @Put('status')
  @UseGuards(StaffGuard)
  async updateStatus(
    @Body() status: Partial<AutomationStatus>,
    @Ctx() ctx: Context,
  ) {
    await this.service.updateStatus(status, ctx);
  }
}
