import {
  concurrent,
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
  concurrency?: number;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { chipset, sources, concurrency } = options;

  const techPowerUp = sources[GpuDataSourceKey.TechPowerUp];
  const passMark = sources[GpuDataSourceKey.VideocardBenchmarks];
  const ulBenchmarks = sources[GpuDataSourceKey.UlBenchmarks];

  // Fetch gpu data (concurrently if desired)
  const [chipsetResult, techPowerUpResult, passMarkResult, ulBenchmarkResult] =
    await concurrent(
      [
        scrapeChipset(chipset),
        scrapeTechPowerUp(techPowerUp),
        scrapePassMark(passMark),
        scrapeUlBenchmarks(ulBenchmarks),
      ],
      {
        limit: concurrency || 1,
      },
    );

  // Merge scraped results
  let hasRetailModels = false;
  let scrapedProduct: Partial<Product> = { meta: { dataSources: {} } };
  if (chipsetResult != null) {
    const { product } = chipsetResult;
    scrapedProduct = deepmerge(scrapedProduct, product);
  }
  if (techPowerUpResult != null) {
    const response = techPowerUpResult as ScrapeProductResponse & {
      hasRetailModels: boolean;
    };
    hasRetailModels = response.hasRetailModels;
    scrapedProduct = deepmerge(scrapedProduct, response.product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.TechPowerUp] = techPowerUp;
  }
  if (passMarkResult != null) {
    const { product } = passMarkResult;
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.VideocardBenchmarks] =
      passMark;
  }
  if (ulBenchmarkResult != null) {
    const { product } = ulBenchmarkResult;
    scrapedProduct = deepmerge(scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.UlBenchmarks] =
      ulBenchmarks;
  }

  return {
    product: scrapedProduct,
    hasRetailModels,
  } as ScrapeProductResponse & { hasRetailModels: boolean };
}

async function scrapeChipset(chipset: Gpu) {
  if (chipset == null) {
    return null;
  }
  return await scrapeFromChipsetGpu({ chipset });
}

async function scrapeTechPowerUp(source: GpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeTechPowerUpGpuData({ url: source.url });
}

async function scrapePassMark(source: GpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapePassMarkGpuData({ url: source.url });
}

async function scrapeUlBenchmarks(source: GpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeUlBenchmarksGpuData({ url: source.url });
}
