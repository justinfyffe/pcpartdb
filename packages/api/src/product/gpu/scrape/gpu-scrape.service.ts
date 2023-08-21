import { Injectable } from '@nestjs/common';
import { scrapeGpu } from '@pcpartdb/scraper';
import {
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  ScrapeProductRequest,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { Context } from 'packages/api/src/shared/context';
import { GpuService } from '../gpu.service';

@Injectable()
export class GpuScrapeService {
  constructor(private gpuService: GpuService) {}

  async scrapeGpu(request: ScrapeProductRequest, ctx: Context) {
    const { sources } = request;

    const response: ScrapeProductResponse = { product: {} };

    let chipset: Gpu;
    const chipsetSource = sources[GpuDataSourceKey.Chipset] as GpuDataSource;
    if (chipsetSource?.chipsetId != null) {
      chipset = await this.getChipset(chipsetSource.chipsetId, ctx);
    }

    const scraped = await scrapeGpu({ sources, chipset });
    response.product = scraped.product;

    return response;
  }

  private async getChipset(chipsetId: number, ctx: Context) {
    return await this.gpuService.getById(chipsetId, {}, ctx);
  }
}
