import {
  ArrayMerge,
  deepmerge,
  Product,
  ProductSource,
  ProductSourceKey,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeGeekBenchCpuData } from './geekbench';
import { scrapePassMarkCpuData } from './passmark';
import { scrapeTechPowerUpCpuData } from './techpowerup';

export interface ScrapeCpuOptions {
  sources?: Partial<ProductSource>[];
}

export async function scrapeCpu(options: ScrapeCpuOptions) {
  const { sources } = options;

  const ctx: ScraperContext = { memoizedFields: {} };
  let scrapedProduct: Partial<Product> = {};
  for (let i = 0; i < sources.length; ++i) {
    const source = sources[i];
    const response = await scrapeSource(source, ctx);
    scrapedProduct = deepmerge(
      { arrayMerge: ArrayMerge.Combine },
      scrapedProduct,
      response.product,
    );
  }

  return { product: scrapedProduct } as ScrapeProductResponse;
}

async function scrapeSource(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
): Promise<ScrapeProductResponse & { hasRetailModels?: boolean }> {
  if (source?.sourceKey === ProductSourceKey.TechPowerUp) {
    return await scrapeTechPowerUp(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.PassMark) {
    return await scrapePassMark(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.GeekBench) {
    return await scrapeGeekBench(source, ctx);
  }

  throw new Error('Unsupported product source to scrape');
}

async function scrapeTechPowerUp(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeTechPowerUpCpuData({ url: source.sourceUrl, ctx });
}

async function scrapePassMark(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapePassMarkCpuData({ url: source.sourceUrl, ctx });
}

async function scrapeGeekBench(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeGeekBenchCpuData({ url: source.sourceUrl, ctx });
}
