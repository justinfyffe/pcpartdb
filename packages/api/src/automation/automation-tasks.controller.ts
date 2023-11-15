import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProductCalculationsRequest } from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';
import { MULTER_OPTIONS } from '../shared/utils';
import { AutomationTasksService } from './automation-tasks.service';

@Controller('automation/tasks')
export class AutomationTasksController {
  constructor(private service: AutomationTasksService) {}

  @Post('product-calculations')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadProductCalculations(
    @Body() body: UploadProductCalculationsRequest,
    @Ctx() ctx: Context,
  ) {
    const timer = `AutomationTasksController.uploadProductCalculations (${uuid.v4()})`;
    console.time(timer);
    await this.service.uploadProductCalculations(body, ctx);
    console.timeEnd(timer);
  }
}
