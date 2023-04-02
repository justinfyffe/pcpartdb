import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportGpusRequest, ScrapeGpuDetailsRequest } from '@pcpartdb/shared';
import { StaffGuard } from '../../auth/staff.guard';
import { Database } from '../../database';
import { Context, Ctx } from '../../shared/context';
import { MULTER_OPTIONS } from '../../shared/utils';
import { GpuImportService } from './gpu-import.service';

interface PreviewGpusImportBody {
  file?: File;
  tempPath?: string;
}

@Controller('gpus/import')
export class GpuImportController {
  constructor(
    private db: Database,
    private gpuImportService: GpuImportService,
  ) {}

  @Post()
  @UseGuards(StaffGuard)
  async import(@Body() body: ImportGpusRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      async () => {
        await this.gpuImportService.import(body, ctx);
      },
      { ctx },
    );
  }

  @Post('scrape')
  @UseGuards(StaffGuard)
  async scrapeDetails(@Body() body: ScrapeGpuDetailsRequest) {
    return await this.gpuImportService.scrapeDetails(body);
  }

  @Post('preview')
  @UseGuards(StaffGuard)
  @UseInterceptors(FileInterceptor('file', MULTER_OPTIONS))
  async previewImport(
    @Body() body: PreviewGpusImportBody,
    @Ctx() ctx: Context,
  ) {
    return await this.db.transaction(
      async () => {
        const file = body.tempPath;
        return await this.gpuImportService.previewImport(file, ctx);
      },
      { ctx },
    );
  }
}
