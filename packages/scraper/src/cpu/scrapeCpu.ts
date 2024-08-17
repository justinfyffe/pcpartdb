import {
  ArrayMerge,
  createEmptyCpuProduct,
  deepmerge,
  generateProductOtherNames,
  generateProductSearchableText,
  Product,
  ProductSource,
  ProductSourceKey,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeGeekBenchCpuData } from './geekbench';
import { scrapeNotebookCheckCpuData } from './notebookcheck';
import { scrapePassMarkCpuData } from './passmark';
import { scrapeTechPowerUpCpuData } from './techpowerup';

const SOURCE_ORDER = [
  ProductSourceKey.TechPowerUp,
  ProductSourceKey.NotebookCheck,
  ProductSourceKey.GeekBench,
  ProductSourceKey.PassMark,
];

export interface ScrapeCpuOptions {
  sources?: Partial<ProductSource>[];
}

export async function scrapeCpu(options: ScrapeCpuOptions) {
  const { sources } = options;

  const ctx: ScraperContext = { memoizedFields: {} };

  let scrapedProduct: Partial<Product> = createEmptyCpuProduct();
  for (const sourceKey of SOURCE_ORDER) {
    const source = sources.filter((s) => s.sourceKey === sourceKey)[0] || null;
    if (source != null) {
      const response = await scrapeSource(source, ctx);
      scrapedProduct = updateScrapedProduct(scrapedProduct, response);
    }
  }

  scrapedProduct.searchText = generateProductSearchableText({
    company: scrapedProduct.company,
    name: scrapedProduct.name,
  });
  scrapedProduct.otherNames = generateProductOtherNames({
    company: scrapedProduct.company,
    name: scrapedProduct.name,
  });

  return { product: scrapedProduct } as ScrapeProductResponse;
}

function updateScrapedProduct(
  scrapedProduct: Partial<Product>,
  response: ScrapeProductResponse,
) {
  return deepmerge(
    { arrayMerge: ArrayMerge.Combine },
    scrapedProduct,
    response.product,
  );
}

async function scrapeSource(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
): Promise<ScrapeProductResponse> {
  if (source?.sourceKey === ProductSourceKey.GeekBench) {
    return await scrapeGeekBench(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.NotebookCheck) {
    return await scrapeNotebookCheck(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.PassMark) {
    return await scrapePassMark(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.TechPowerUp) {
    return await scrapeTechPowerUp(source, ctx);
  }

  throw new Error('Unsupported product source to scrape');
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

async function scrapeNotebookCheck(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeNotebookCheckCpuData({ url: source.sourceUrl, ctx });
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

async function scrapeTechPowerUp(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeTechPowerUpCpuData({ url: source.sourceUrl, ctx });
}
