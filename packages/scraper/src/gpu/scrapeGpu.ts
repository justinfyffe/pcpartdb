import {
  ArrayMerge,
  deepmerge,
  generateProductOtherNames,
  GpuProduct,
  Product,
  ProductSource,
  ProductSourceKey,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapePassMarkGpuData } from './passmark';
import { scrapeFromChipsetGpu } from './scrapeFromChipsetGpu';
import { scrapeTechPowerUpGpuData } from './techpowerup';
import { scrapeUlBenchmarksGpuData } from './ul-benchmarks';

export interface ScrapeGpuOptions {
  sources?: Partial<ProductSource>[];
  chipset?: GpuProduct;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { chipset, sources } = options;

  const ctx: ScraperContext = { memoizedFields: {} };
  let scrapedProduct: Partial<Product> = {};
  let hasRetailModels = false;
  for (let i = 0; i < sources.length; ++i) {
    const source = sources[i];
    const response = await scrapeSource(source, ctx);
    hasRetailModels = response?.hasRetailModels ?? hasRetailModels;
    scrapedProduct = deepmerge(
      { arrayMerge: ArrayMerge.Combine },
      scrapedProduct,
      response.product,
    );
  }

  if (chipset != null) {
    const response = await scrapeChipset({ sourceProduct: chipset }, ctx);
    scrapedProduct = deepmerge(
      { arrayMerge: ArrayMerge.Combine },
      scrapedProduct,
      response.product,
    );
  }

  scrapedProduct.otherNames = generateProductOtherNames({
    company: scrapedProduct.company,
    name: scrapedProduct.name,
  });

  return {
    product: scrapedProduct,
    hasRetailModels,
  } as ScrapeProductResponse & { hasRetailModels: boolean };
}

async function scrapeSource(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
): Promise<ScrapeProductResponse & { hasRetailModels?: boolean }> {
  if (source?.sourceProduct != null) {
    return await scrapeChipset(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.TechPowerUp) {
    return await scrapeTechPowerUp(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.PassMark) {
    return await scrapePassMark(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.UlBenchmarks) {
    return await scrapeUlBenchmarks(source, ctx);
  }

  throw new Error('Unsupported product source to scrape');
}

async function scrapeChipset(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceProduct == null) {
    return null;
  }
  return await scrapeFromChipsetGpu({
    chipset: source.sourceProduct as GpuProduct,
    ctx,
  });
}

async function scrapeTechPowerUp(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeTechPowerUpGpuData({ url: source.sourceUrl, ctx });
}

async function scrapePassMark(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapePassMarkGpuData({ url: source.sourceUrl, ctx });
}

async function scrapeUlBenchmarks(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }

  try {
    return await scrapeUlBenchmarksGpuData({ url: source.sourceUrl, ctx });
  } catch (e) {
    console.error('Fetching GPU data from UL Benchmarks failed. Ignoring it.');
    return null;
  }
}
