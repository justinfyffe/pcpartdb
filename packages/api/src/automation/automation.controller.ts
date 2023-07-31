import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateAutomationActionRequest,
  ListAutomationActionsRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../auth/staff.guard';
import { Database } from '../database';
import { Context, Ctx } from '../shared/context';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private service: AutomationService, private db: Database) {}

  @Get('actions/next')
  @UseGuards(StaffGuard)
  async getNextEntry(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.getNextPending(ctx);
      },
      { ctx },
    );
  }

  @Get('actions/next-backlog')
  @UseGuards(StaffGuard)
  async getNextBacklogEntry(@Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        return await this.service.getNextBacklog(ctx);
      },
      { ctx },
    );
  }

  @Get('actions/pending')
  @UseGuards(StaffGuard)
  async listPending(@Query('req') request: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body: ListAutomationActionsRequest =
          request != null ? JSON.parse(request) : null;

        return await this.service.listPending(body, ctx);
      },
      { ctx },
    );
  }

  @Post('actions')
  @UseGuards(StaffGuard)
  async create(
    @Body() body: CreateAutomationActionRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        await this.service.create(body, ctx);
      },
      { ctx },
    );
  }

  @Post('actions/:id/cancel')
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

  @Post('actions/:id/processing')
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

  @Post('actions/:id/processed')
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

  @Post('actions/:id/failed')
  @UseGuards(StaffGuard)
  async markAsFailed(@Param('id') idStr: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const id = Number(idStr);
        await this.service.markAsFailed(id, ctx);
      },
      { ctx },
    );
  }
}
