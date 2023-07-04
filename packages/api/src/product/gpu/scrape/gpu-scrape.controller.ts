import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ScrapeProductRequest } from '@pcpartdb/shared';
import { Database } from 'packages/api/src/database';
import { Context, Ctx } from 'packages/api/src/shared/context';
import { StaffGuard } from '../../../auth/staff.guard';
import { GpuScrapeService } from './gpu-scrape.service';

@Controller('products/gpus/scrape')
export class GpuScrapeController {
  constructor(
    private db: Database,
    private gpuScrapeService: GpuScrapeService,
  ) {}

  @Post()
  @UseGuards(StaffGuard)
  async scrape(@Body() body: ScrapeProductRequest, @Ctx() ctx: Context) {
    return await this.db.transaction(
      () => this.gpuScrapeService.scrapeGpu(body, ctx),
      { ctx },
    );
  }
}
