import {
  Body,
  Controller,
  Delete,
  Get,
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
import { validate } from '../shared/validation/validate';
import { AutomationService } from './automation.service';
import {
  enqueueAutomationRequestValidator,
  listAutomationQueueRequestValidator,
} from './automation.validators';

@Controller('automation')
export class AutomationController {
  constructor(private service: AutomationService, private db: Database) {}

  @Get('queue/next')
  @UseGuards(StaffGuard)
  async getNextEntry(@Ctx() ctx: Context) {
    // TODO
  }

  @Get('queue')
  @UseGuards(StaffGuard)
  async listQueue(@Query('req') request: string, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        const body: ListAutomationQueueRequest =
          request != null
            ? (JSON.parse(request) as ListAutomationQueueRequest)
            : null;

        validate(request, listAutomationQueueRequestValidator);
        // return await this.service.listQueue(body, ctx);
      },
      { ctx },
    );
  }

  @Post('queue')
  @UseGuards(StaffGuard)
  async enqueue(@Body() body: EnqueueAutomationRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        validate(body, enqueueAutomationRequestValidator);
        await this.service.enqueue(body, ctx);
      },
      { ctx },
    );
  }

  @Put('queue')
  @UseGuards(StaffGuard)
  async updateEntry(@Ctx() ctx: Context) {
    // TODO
  }

  @Delete('queue/:id')
  @UseGuards(StaffGuard)
  async deleteEntry(@Ctx() ctx: Context) {
    // TODO
  }
}
