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
import { MULTER_OPTIONS } from '../shared/utils';
import { AutomationTasksService } from './automation-tasks.service';

@Controller('automation/tasks')
export class AutomationTasksController {
  constructor(private service: AutomationTasksService) {}

  @Post('product-ranks')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadProductRanks(
    @Body() body: UploadProductRanksRequest,
    @Ctx() ctx: Context,
  ) {
    const timer = `AutomationTasksController.uploadProductRanks (${uuid.v4()})`;
    console.time(timer);
    await this.service.uploadProductRanks(body, ctx);
    console.timeEnd(timer);
  }

  @Post('related-products')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async uploadRelatedProducts(
    @Body() body: UploadRelatedProductsRequest,
    @Ctx() ctx: Context,
  ) {
    const timer = `AutomationTasksController.uploadRelatedProducts (${uuid.v4()})`;
    console.time(timer);
    await this.service.uploadRelatedProducts(body, ctx);
    console.timeEnd(timer);
  }
}
