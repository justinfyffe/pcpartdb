import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';

@Controller('automation')
export class AutomationController {
  @Get('queue/next')
  @UseGuards(StaffGuard)
  async getNextQueueEntry(@Ctx() ctx: Context) {
    //
  }

  @Post('queue')
  @UseGuards(StaffGuard)
  async addQueueEntry(@Ctx() ctx: Context) {
    //
  }

  @Put('queue')
  async updateQueueEntry(@Ctx() ctx: Context) {
    //
  }

  @Delete('queue/:id')
  @UseGuards(StaffGuard)
  async deleteQueueEntry(@Ctx() ctx: Context) {
    //
  }
}
