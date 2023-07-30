import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  EnqueueAutomationRequest,
  ListAutomationQueueRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private service: AutomationService, private db: Database) {}

  @Get('queue/next')
  @UseGuards(StaffGuard)
  async getNextEntry(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.getNextPending(ctx);
      },
      { ctx },
    );
  }

  @Get('queue/pending')
  @UseGuards(StaffGuard)
  async listPending(@Query('req') request: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body: ListAutomationQueueRequest =
          request != null ? JSON.parse(request) : null;

        return await this.service.listPending(body, ctx);
      },
      { ctx },
    );
  }

  @Post('queue')
  @UseGuards(StaffGuard)
  async enqueue(@Body() body: EnqueueAutomationRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        await this.service.enqueue(body, ctx);
      },
      { ctx },
    );
  }

  @Post('queue/:id/processing')
  @UseGuards(StaffGuard)
  async markAsProcessing(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.markAsProcessing(id, ctx);
      },
      { ctx },
    );
  }

  @Post('queue/:id/processed')
  @UseGuards(StaffGuard)
  async markAsProcessed(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.markAsProcessed(id, ctx);
      },
      { ctx },
    );
  }

  @Post('queue/:id/failed')
  @UseGuards(StaffGuard)
  async markAsFailed(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.markAsProcessed(id, ctx);
      },
      { ctx },
    );
  }

  @Post('queue/:id/cancel')
  @UseGuards(StaffGuard)
  async cancel(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.cancel(id, ctx);
      },
      { ctx },
    );
  }
}
