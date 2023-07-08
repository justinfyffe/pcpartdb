import { Injectable } from '@nestjs/common';
import {
  scrapePassMarkGpuData,
  scrapeTechPowerUpGpuData,
  scrapeUlBenchmarksGpuData,
} from '@pcpartdb/scraper';
import {
  GpuDataSource,
  GpuDataSourceKey,
  ScrapeProductRequest,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { Context } from 'packages/api/src/shared/context';
import { badRequestError } from 'packages/api/src/shared/error';
import { GpuService } from '../gpu.service';

enum Importers {
  TechPowerUp = 'www.techpowerup.com',
  UlBenchmarks = 'benchmarks.ul.com',
  VideocardBenchmark = 'www.videocardbenchmark.net',
}

@Injectable()
export class GpuScrapeService {
  constructor(private gpuService: GpuService) {}

  async scrapeGpu(request: ScrapeProductRequest, ctx: Context) {
    const { sources } = request;

    let result: ScrapeProductResponse = { product: {} };

    if (sources[GpuDataSourceKey.Chipset] != null) {
      result = deepmerge(
        result,
        await this.scrapeDetailsFromSource(
          sources[GpuDataSourceKey.Chipset],
          ctx,
        ),
      );
    }
    if (sources[GpuDataSourceKey.TechPowerUp] != null) {
      result = deepmerge(
        result,
        await this.scrapeDetailsFromSource(
          sources[GpuDataSourceKey.TechPowerUp],
          ctx,
        ),
      );
    }
    if (sources[GpuDataSourceKey.VideocardBenchmarks] != null) {
      result = deepmerge(
        result,
        await this.scrapeDetailsFromSource(
          sources[GpuDataSourceKey.VideocardBenchmarks],
          ctx,
        ),
      );
    }
    if (sources[GpuDataSourceKey.UlBenchmarks] != null) {
      result = deepmerge(
        result,
        await this.scrapeDetailsFromSource(
          sources[GpuDataSourceKey.UlBenchmarks],
          ctx,
        ),
      );
    }

    return result;
  }

  private async scrapeDetailsFromSource(source: GpuDataSource, ctx: Context) {
    if (source.chipsetId != null) {
      return await this.scrapeDetailsFromGpu(source.chipsetId, ctx);
    } else if (source.url != null) {
      return await this.scrapeDetailsFromUrl(source.url);
    }

    return {} as ScrapeProductResponse;
  }

  private async scrapeDetailsFromGpu(gpuId: number, ctx: Context) {
    const gpu = await this.gpuService.getById(gpuId, {}, ctx);
    return {
      product: {
        marketSegment: gpu.marketSegment,
        productionStatus: gpu.productionStatus,
      },
    } as ScrapeProductResponse;
  }

  private async scrapeDetailsFromUrl(url: string) {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === Importers.TechPowerUp) {
      return await scrapeTechPowerUpGpuData({ url });
    } else if (parsedUrl.hostname === Importers.UlBenchmarks) {
      return await scrapeUlBenchmarksGpuData({ url });
    } else if (parsedUrl.hostname === Importers.VideocardBenchmark) {
      return await scrapePassMarkGpuData({ url });
    } else {
      throw badRequestError();
    }
  }
}
