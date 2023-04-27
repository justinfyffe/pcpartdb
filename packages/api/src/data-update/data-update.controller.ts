import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import {
  ListDataUpdatesRequest,
  ListDataUpdatesResponse,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { validate } from '../shared/types/validate';
import { DataUpdateService } from './data-update.service';
import { listUpdatesRequestValidator } from './data-update.validators';

@Controller('data-updates')
export class DataUpdateController {
  constructor(
    private db: Database,
    private dataUpdateService: DataUpdateService,
  ) {}

  @Get()
  @UseGuards(StaffGuard)
  async getUpdates(@Query('q') q: string, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        const data = JSON.parse(q) as ListDataUpdatesRequest;
        validate(data, listUpdatesRequestValidator);
        const updates = await this.dataUpdateService.getUpdates(data, ctx);
        const totalUpdates = await this.dataUpdateService.countUpdates(
          data,
          ctx,
        );

        return {
          status: data.status,
          updates: updates,
          totalUpdates: totalUpdates,
        } as ListDataUpdatesResponse;
      },
      { ctx },
    );
  }

  @Get(':id')
  @UseGuards(StaffGuard)
  async getUpdate(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return this.db.transaction(
      async () => {
        const id = Number(idStr);
        return await this.dataUpdateService.getUpdate(id, ctx);
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
