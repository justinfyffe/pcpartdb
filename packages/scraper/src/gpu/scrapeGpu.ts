import {
  ArrayMerge,
  deepmerge,
  Game,
  generateProductOtherNames,
  generateProductSearchableText,
  Product,
  ProductSource,
  ProductSourceKey,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeNotebookCheckGpuData } from './notebookcheck';
import { scrapePassMarkGpuData } from './passmark';
import { scrapeTechPowerUpGpuData } from './techpowerup';

const SOURCE_ORDER = [
  ProductSourceKey.TechPowerUp,
  ProductSourceKey.NotebookCheck,
  ProductSourceKey.PassMark,
];

export interface ScrapeGpuOptions {
  sources?: Partial<ProductSource>[];
  games?: Partial<Game>[];
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { sources, games } = options;

  const ctx: ScraperContext = { memoizedFields: {} };
  let scrapedProduct: Partial<Product> = {};

  for (const sourceKey of SOURCE_ORDER) {
    const source = sources.filter((s) => s.sourceKey === sourceKey)[0] || null;
    if (source != null) {
      const response = await scrapeSource(source, games, ctx);
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

  return {
    product: scrapedProduct,
  } as ScrapeProductResponse;
}

function updateScrapedProduct(
  scrapedProduct: Partial<Product>,
  response: ScrapeProductResponse,
) {
  return deepmerge(
    { arrayMerge: ArrayMerge.Combine },
    scrapedProduct,
    response?.product ?? {},
  );
}

async function scrapeSource(
  source: Partial<ProductSource>,
  games: Partial<Game>[] | null,
  ctx: ScraperContext,
): Promise<ScrapeProductResponse> {
  if (source?.sourceKey === ProductSourceKey.NotebookCheck) {
    return await scrapeNotebookCheck(source, games, ctx);
  } else if (source?.sourceKey === ProductSourceKey.PassMark) {
    return await scrapePassMark(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.TechPowerUp) {
    return await scrapeTechPowerUp(source, ctx);
  }

  throw new Error('Unsupported product source to scrape');
}

async function scrapeNotebookCheck(
  source: Partial<ProductSource>,
  games: Partial<Game>[] | null,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeNotebookCheckGpuData({
    url: source.sourceUrl,
    games,
    ctx,
  });
}

async function scrapePassMark(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }

  try {
    return await scrapePassMarkGpuData({ url: source.sourceUrl, ctx });
  } catch (e) {
    console.error('Fetching GPU data from PassMark failed. Ignoring it.');
    return null;
  }
}

async function scrapeTechPowerUp(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeTechPowerUpGpuData({
    url: source.sourceUrl,
    ctx,
  });
}
