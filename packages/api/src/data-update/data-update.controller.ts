import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import {
  ListPendingUpdatesRequest,
  ListPendingUpdatesResponse,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { DataUpdateService } from './data-update.service';
import { listPendingUpdatesRequestValidator } from './data-update.validators';

@Controller('data-updates')
export class DataUpdateController {
  constructor(
    private db: Database,
    private dataUpdateService: DataUpdateService,
  ) {}

  @Get('pending')
  @UseGuards(StaffGuard)
  async getPendingUpdates(@Query('q') q: string, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        const data = JSON.parse(q) as ListPendingUpdatesRequest;
        validate(data, listPendingUpdatesRequestValidator);
        const pendingUpdates = await this.dataUpdateService.getPendingUpdates(
          data,
          ctx,
        );
        const totalPendingUpdates =
          await this.dataUpdateService.countPendingUpdates(ctx);

        return {
          pendingUpdates,
          totalPendingUpdates,
        } as ListPendingUpdatesResponse;
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
