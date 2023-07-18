import { Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';

@Controller('autopilot')
export class AutopilotController {
  @Get('queue/next')
  @UseGuards(StaffGuard)
  async getNextQueueEntry(@Ctx() ctx: Context) {
    //
  }

  @Delete('queue/:id')
  @UseGuards(StaffGuard)
  async deleteQueueEntry(@Ctx() ctx: Context) {
    //
  }

  @Post('check-cpu-sources')
  @UseGuards(StaffGuard)
  async checkCpuSources(@Ctx() ctx: Context) {
    //
  }

  @Post('approvals')
  @UseGuards(StaffGuard)
  async createApprovals(@Ctx() ctx: Context) {
    //
  }

  @Post('logs')
  @UseGuards(StaffGuard)
  async createLogs(@Ctx() ctx: Context) {
    //
  }
}
