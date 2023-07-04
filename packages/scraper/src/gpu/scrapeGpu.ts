import {
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { scrapeTechPowerUpGpuDetails } from '../techpowerup';
import { scrapeUlBenchmarksGpuDetails } from '../ul-benchmarks';
import { scrapeVideocardBenchmarksGpuDetails } from '../videocardbenchmarks';
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
    const { product } = await scrapeTechPowerUpGpuDetails({
      url: techPowerUpUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (ulBenchmarksUrl != null) {
    const { product } = await scrapeUlBenchmarksGpuDetails({
      url: ulBenchmarksUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (videocardBenchmarkUrl != null) {
    const { product } = await scrapeVideocardBenchmarksGpuDetails({
      url: videocardBenchmarkUrl,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}
