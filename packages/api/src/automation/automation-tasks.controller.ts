import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UploadProductRanksRequest,
  UploadRelatedProductsRequest,
} from '@pcpartdb/shared';
import * as uuid from 'uuid';
import { StaffGuard } from '../auth/staff.guard';
import { Context, Ctx } from '../shared/context';
import { TimerInterceptor } from '../shared/timer/timer.interceptor';
import { MULTER_OPTIONS } from '../shared/utils';
import { AutomationTasksService } from './automation-tasks.service';

@Controller('automation/tasks')
export class AutomationTasksController {
  constructor(private service: AutomationTasksService) {}

  @Post('product-ranks')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS), TimerInterceptor)
  async uploadProductRanks(
    @Body() body: UploadProductRanksRequest,
    @Ctx() ctx: Context,
  ) {
    await this.service.uploadProductRanks(body, ctx);
  }

  @Post('related-products')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS), TimerInterceptor)
  async uploadRelatedProducts(
    @Body() body: UploadRelatedProductsRequest,
    @Ctx() ctx: Context,
  ) {
    await this.service.uploadRelatedProducts(body, ctx);
  }
}
