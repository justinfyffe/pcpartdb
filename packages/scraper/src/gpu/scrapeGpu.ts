import {
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { scrapeTechPowerUpGpuData } from './techpowerup';
import { scrapeUlBenchmarksGpuData } from './ul-benchmarks';
import { scrapePassMarkGpuData } from './passmark';
import { scrapeFromChipsetGpu } from './scrapeFromChipsetGpu';

export interface ScrapeGpuOptions {
  sources: Record<string, GpuDataSource>;
  chipset?: Gpu;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { chipset, sources } = options;

  const techPowerUpUrl = sources[GpuDataSourceKey.TechPowerUp]?.url;
  const ulBenchmarksUrl = sources[GpuDataSourceKey.UlBenchmarks]?.url;
  const videocardBenchmarkUrl =
    sources[GpuDataSourceKey.VideocardBenchmarks]?.url;

  let scrapedProduct: Partial<Product> = {};
  if (chipset != null) {
    const { product } = await scrapeFromChipsetGpu({ chipset });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (techPowerUpUrl != null) {
    const { product } = await scrapeTechPowerUpGpuData({
      url: techPowerUpUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (ulBenchmarksUrl != null) {
    const { product } = await scrapeUlBenchmarksGpuData({
      url: ulBenchmarksUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (videocardBenchmarkUrl != null) {
    const { product } = await scrapePassMarkGpuData({
      url: videocardBenchmarkUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}
