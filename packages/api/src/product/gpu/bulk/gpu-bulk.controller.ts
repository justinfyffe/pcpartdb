import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ImportProductsRequest,
  PreviewImportProductsRequest,
} from '@pcpartdb/shared';
import { StaffGuard } from '../../../auth/staff.guard';
import { Database } from '../../../database';
import { Context, Ctx } from '../../../shared/context';
import { MULTER_OPTIONS } from '../../../shared/utils';
import { GpuBulkService } from './gpu-bulk.service';

@Controller('products/gpus/bulk')
export class GpuBulkController {
  constructor(private db: Database, private gpuBulkService: GpuBulkService) {}

  @Post()
  @UseGuards(StaffGuard)
  async import(@Body() body: ImportProductsRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        await this.gpuBulkService.importBulk(body, ctx);
      },
      { ctx },
    );
  }

  @Post('preview')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async previewImport(
    @Body() body: PreviewImportProductsRequest,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        return await this.gpuBulkService.previewImportBulk(body, ctx);
      },
      { ctx },
    );
  }
}
