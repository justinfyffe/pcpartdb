import {
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { scrapePassMarkGpuData } from './passmark';
import { scrapeFromChipsetGpu } from './scrapeFromChipsetGpu';
import { scrapeTechPowerUpGpuData } from './techpowerup';
import { scrapeUlBenchmarksGpuData } from './ul-benchmarks';

export interface ScrapeGpuOptions {
  sources: Record<string, GpuDataSource>;
  chipset?: Gpu;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { chipset, sources } = options;

  const techPowerUp = sources[GpuDataSourceKey.TechPowerUp];
  const ulBenchmarks = sources[GpuDataSourceKey.UlBenchmarks];
  const videocardBenchmark = sources[GpuDataSourceKey.VideocardBenchmarks];

  let hasRetailModels = false;
  let scrapedProduct: Partial<Product> = { meta: { dataSources: {} } };
  if (chipset != null) {
    const { product } = await scrapeFromChipsetGpu({ chipset });
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (techPowerUp?.url != null) {
    const response = await scrapeTechPowerUpGpuData({ url: techPowerUp.url });
    const product = response.product;
    hasRetailModels = response.hasRetailModels;
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.TechPowerUp] = techPowerUp;
  }
  if (ulBenchmarks?.url != null) {
    const { product } = await scrapeUlBenchmarksGpuData({
      url: ulBenchmarks.url,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.UlBenchmarks] =
      ulBenchmarks;
  }
  if (videocardBenchmark?.url != null) {
    const { product } = await scrapePassMarkGpuData({
      url: videocardBenchmark.url,
    });
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.VideocardBenchmarks] =
      videocardBenchmark;
  }

  return {
    product: scrapedProduct,
    hasRetailModels,
  } as ScrapeProductResponse & { hasRetailModels: boolean };
}
