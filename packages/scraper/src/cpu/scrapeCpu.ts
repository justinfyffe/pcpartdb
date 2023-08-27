import {
  concurrent,
  CpuDataSource,
  CpuDataSourceKey,
  deepmerge,
  Product,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { scrapeGeekBenchCpuData } from './geekbench';
import { scrapePassMarkCpuData } from './passmark';
import { scrapeTechPowerUpCpuData } from './techpowerup';

export interface ScrapeCpuOptions {
  sources: Record<string, CpuDataSource>;
  concurrency?: number;
  delayBetweenChunksMs?: number;
}

export async function scrapeCpu(options: ScrapeCpuOptions) {
  const { sources, concurrency, delayBetweenChunksMs } = options;

  const techPowerUp = sources[CpuDataSourceKey.TechPowerUp];
  const passMark = sources[CpuDataSourceKey.PassMark];
  const geekBench = sources[CpuDataSourceKey.GeekBench];

  // Fetch cpu data (concurrently if desired)
  const [techPowerUpResult, passMarkResult, geekBenchResult] = await concurrent(
    [
      () => scrapeTechPowerUp(techPowerUp),
      () => scrapePassMark(passMark),
      () => scrapeGeekBench(geekBench),
    ],
    {
      limit: concurrency || 1,
      delayBetweenChunksMs: delayBetweenChunksMs || 0,
    },
  );

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

async function scrapeTechPowerUp(source: CpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeTechPowerUpCpuData({ url: source.url });
}

async function scrapePassMark(source: CpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapePassMarkCpuData({ url: source.url });
}

async function scrapeGeekBench(source: CpuDataSource) {
  if (source?.url == null) {
    return null;
  }
  return await scrapeGeekBenchCpuData({ url: source.url });
}
