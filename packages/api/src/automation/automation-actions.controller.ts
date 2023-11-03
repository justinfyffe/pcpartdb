import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AutomationActionStatus,
  CreateAutomationActionRequest,
  ListAutomationActionsRequest,
  UploadPerformanceScoresRequest,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';
import { MULTER_OPTIONS } from '../shared/utils';
import { AutomationActionsService } from './automation-actions.service';

@Controller('automation/actions')
export class AutomationActionsController {
  constructor(private service: AutomationActionsService) {}

  @Post('performance-scores')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadPerformanceScores(
    @Body() body: UploadPerformanceScoresRequest,
    @Ctx() ctx: Context,
  ) {
    const timer = `AutomationActionsController.uploadPerformanceScores (${uuid.v4()})`;
    console.time(timer);
    await this.service.uploadPerformanceScoresAction(body, ctx);
    console.timeEnd(timer);
  }

  @Get('next')
  @UseGuards(StaffGuard)
  async getNextEntry(@Ctx() ctx: Context) {
    return await this.service.getNextPending(ctx);
  }

  @Post('next-backlog')
  @UseGuards(StaffGuard)
  async getNextBacklogEntry(@Ctx() ctx: Context) {
    return await this.service.getNextBacklog(ctx);
  }

  @Get('pending')
  @UseGuards(StaffGuard)
  async listPending(@Query('req') request: string, @Ctx() ctx: Context) {
    const body: ListAutomationActionsRequest =
      request != null ? JSON.parse(request) : null;

    return await this.service.listPending(body, ctx);
  }

  @Post()
  @UseGuards(StaffGuard)
  async create(
    @Body() body: CreateAutomationActionRequest,
    @Ctx() ctx: Context,
  ) {
    await this.service.create(body, ctx);
  }

  @Post(':id/cancel')
  @UseGuards(StaffGuard)
  async markAsCanceled(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    await this.service.updateActionStatus(
      id,
      AutomationActionStatus.Canceled,
      ctx,
    );
  }

  @Post(':id/pending')
  @UseGuards(StaffGuard)
  async markAsPending(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    await this.service.updateActionStatus(
      id,
      AutomationActionStatus.Pending,
      ctx,
    );
  }

  @Post(':id/processing')
  @UseGuards(StaffGuard)
  async markAsProcessing(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    await this.service.updateActionStatus(
      id,
      AutomationActionStatus.Processing,
      ctx,
    );
  }

  @Post(':id/processed')
  @UseGuards(StaffGuard)
  async markAsProcessed(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    await this.service.updateActionStatus(
      id,
      AutomationActionStatus.Processed,
      ctx,
    );
  }

  @Post(':id/failed')
  @UseGuards(StaffGuard)
  async markAsFailed(@Param('id') idStr: string, @Ctx() ctx: Context) {
    const id = Number(idStr);
    await this.service.updateActionStatus(
      id,
      AutomationActionStatus.Failed,
      ctx,
    );
  }
}
