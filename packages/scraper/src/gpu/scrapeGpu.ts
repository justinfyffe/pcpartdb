import {
  ArrayMerge,
  deepmerge,
  generateProductOtherNames,
  generateProductSearchableText,
  GpuProduct,
  Product,
  ProductSource,
  ProductSourceKey,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import { ScraperContext } from '../types';
import { scrapeNotebookCheckGpuData } from './notebookcheck';
import { scrapePassMarkGpuData } from './passmark';
import { scrapeFromChipsetGpu } from './scrapeFromChipsetGpu';
import { scrapeTechPowerUpGpuData } from './techpowerup';

const SOURCE_ORDER = [
  ProductSourceKey.TechPowerUp,
  ProductSourceKey.NotebookCheck,
  ProductSourceKey.PassMark,
];

export interface ScrapeGpuOptions {
  sources?: Partial<ProductSource>[];
  chipset?: GpuProduct;
}

export async function scrapeGpu(options: ScrapeGpuOptions) {
  const { chipset, sources } = options;

  const ctx: ScraperContext = { memoizedFields: {} };
  let scrapedProduct: Partial<Product> = {};
  let hasRetailModels = false;

  if (chipset != null) {
    const response = await scrapeChipset({ sourceProduct: chipset }, ctx);
    scrapedProduct = deepmerge(
      { arrayMerge: ArrayMerge.Combine },
      scrapedProduct,
      response.product,
    );
  }

  for (const sourceKey of SOURCE_ORDER) {
    const source = sources.filter((s) => s.sourceKey === sourceKey)[0] || null;
    if (source != null) {
      const response = await scrapeSource(source, ctx);
      hasRetailModels = response?.hasRetailModels ?? hasRetailModels;
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
    hasRetailModels,
  } as ScrapeProductResponse & { hasRetailModels: boolean };
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
  ctx: ScraperContext,
): Promise<ScrapeProductResponse & { hasRetailModels?: boolean }> {
  if (source?.sourceProduct != null) {
    return await scrapeChipset(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.NotebookCheck) {
    return await scrapeNotebookCheck(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.PassMark) {
    return await scrapePassMark(source, ctx);
  } else if (source?.sourceKey === ProductSourceKey.TechPowerUp) {
    return await scrapeTechPowerUp(source, ctx);
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

async function scrapeNotebookCheck(
  source: Partial<ProductSource>,
  ctx: ScraperContext,
) {
  if (source?.sourceUrl == null) {
    return null;
  }
  return await scrapeNotebookCheckGpuData({ url: source.sourceUrl, ctx });
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
  try {
    return await scrapeTechPowerUpGpuData({ url: source.sourceUrl, ctx });
  } catch (e) {
    console.error('Fetching GPU data from TechPowerUp failed. Ignoring it.');
    return null;
  }
}
