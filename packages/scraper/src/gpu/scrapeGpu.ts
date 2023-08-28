import {
  deepmerge,
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
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
  const passMark = sources[GpuDataSourceKey.VideocardBenchmarks];
  const ulBenchmarks = sources[GpuDataSourceKey.UlBenchmarks];

  // Fetch gpu data
  const ctx: ScraperContext = { memoizedFields: {} };
  const chipsetResult = await scrapeChipset(chipset, ctx);
  const techPowerUpResult = await scrapeTechPowerUp(techPowerUp, ctx);
  const passMarkResult = await scrapePassMark(passMark, ctx);
  const ulBenchmarkResult = await scrapeUlBenchmarks(ulBenchmarks, ctx);

  // Merge scraped results
  let hasRetailModels = false;
  let scrapedProduct: Partial<Product> = { meta: { dataSources: {} } };
  if (techPowerUpResult != null) {
    const response = techPowerUpResult as ScrapeProductResponse & {
      hasRetailModels: boolean;
    };
    hasRetailModels = response.hasRetailModels;
    scrapedProduct = deepmerge({}, scrapedProduct, response.product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.TechPowerUp] = techPowerUp;
  }
  if (passMarkResult != null) {
    const { product } = passMarkResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.VideocardBenchmarks] =
      passMark;
  }
  if (ulBenchmarkResult != null) {
    const { product } = ulBenchmarkResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
    scrapedProduct.meta.dataSources[GpuDataSourceKey.UlBenchmarks] =
      ulBenchmarks;
  }
  if (chipsetResult != null) {
    const { product } = chipsetResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
  }

  return {
    product: scrapedProduct,
    hasRetailModels,
  } as ScrapeProductResponse & { hasRetailModels: boolean };
}

async function scrapeChipset(chipset: Gpu, ctx: ScraperContext) {
  if (chipset == null) {
    return null;
  }
  return await scrapeFromChipsetGpu({ chipset, ctx });
}

async function scrapeTechPowerUp(source: GpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeTechPowerUpGpuData({ url: source.url, ctx });
}

async function scrapePassMark(source: GpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }
  return await scrapePassMarkGpuData({ url: source.url, ctx });
}

async function scrapeUlBenchmarks(source: GpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }

  try {
    return await scrapeUlBenchmarksGpuData({ url: source.url, ctx });
  } catch (e) {
    console.error('Fetching GPU data from UL Benchmarks failed. Ignoring it.');
    return null;
  }
}
