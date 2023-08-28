import {
  CpuDataSource,
  CpuDataSourceKey,
  deepmerge,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeGeekBenchCpuData } from './geekbench';
import { scrapePassMarkCpuData } from './passmark';
import { scrapeTechPowerUpCpuData } from './techpowerup';

export interface ScrapeCpuOptions {
  sources: Record<string, CpuDataSource>;
}

export async function scrapeCpu(options: ScrapeCpuOptions) {
  const { sources } = options;

  const techPowerUp = sources[CpuDataSourceKey.TechPowerUp];
  const passMark = sources[CpuDataSourceKey.PassMark];
  const geekBench = sources[CpuDataSourceKey.GeekBench];

  // Fetch cpu data
  const ctx: ScraperContext = { memoizedFields: {} };
  const techPowerUpResult = await scrapeTechPowerUp(techPowerUp, ctx);
  const passMarkResult = await scrapePassMark(techPowerUp, ctx);
  const geekBenchResult = await scrapeGeekBench(geekBench, ctx);

  // Merge scraped results
  let scrapedProduct: Partial<Product> = { meta: { dataSources: {} } };
  if (techPowerUpResult != null) {
    const { product } = techPowerUpResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.TechPowerUp] = techPowerUp;
  }
  if (passMarkResult != null) {
    const { product } = passMarkResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.PassMark] = passMark;
  }
  if (geekBenchResult != null) {
    const { product } = geekBenchResult;
    scrapedProduct = deepmerge({}, scrapedProduct, product);
    scrapedProduct.meta.dataSources[CpuDataSourceKey.GeekBench] = geekBench;
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}

async function scrapeTechPowerUp(source: CpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeTechPowerUpCpuData({ url: source.url, ctx });
}

async function scrapePassMark(source: CpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }
  return await scrapePassMarkCpuData({ url: source.url, ctx });
}

async function scrapeGeekBench(source: CpuDataSource, ctx: ScraperContext) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeGeekBenchCpuData({ url: source.url, ctx });
}
