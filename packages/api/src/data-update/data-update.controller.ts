import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { DataUpdateService } from './data-update.service';

@Controller('data-updates')
export class DataUpdateController {
  constructor(
    private db: Database,
    private dataUpdateService: DataUpdateService,
  ) {}

  @Get('pending')
  @UseGuards(StaffGuard)
  async getPendingUpdates(@Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        return await this.dataUpdateService.getPendingUpdates({}, ctx);
      },
      { ctx },
    );
  }

  @Put(':id/approve')
  @UseGuards(StaffGuard)
  async approveUpdate(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        const id = Number(idStr);
        return await this.dataUpdateService.approveUpdate(id, ctx);
      },
      { ctx },
    );
  }

  @Put(':id/reject')
  @UseGuards(StaffGuard)
  async rejectUpdate(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        const id = Number(idStr);
        return await this.dataUpdateService.rejectUpdate(id, ctx);
      },
      { ctx },
    );
  }
}
