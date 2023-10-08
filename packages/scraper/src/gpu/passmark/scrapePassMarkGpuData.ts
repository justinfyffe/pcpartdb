import {
  BenchmarKey,
  formatMarketSegment,
  GpuField,
  GpuFields,
  GpuProduct,
  MarketSegment,
  ProductBenchmark,
  ProductType,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createGpuField } from '../utils';

export interface ScrapePassMarkGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function scrapePassMarkGpuData(
  options: ScrapePassMarkGpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const fields: GpuFields = {
    marketSegment: getMarketSegment($, ctx),
  };

  const benchmarks: ProductBenchmark[] = [getG3dMark($), getG2dMark($)].filter(
    (value) => value != null,
  );

  const product: Partial<GpuProduct> = {
    productType: ProductType.Gpu,
    fields,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getG3dMark($: cheerio.CheerioAPI): ProductBenchmark {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  const value = g3dMark ? Number(g3dMark) : null;
  return {
    benchmarkKey: BenchmarKey.G3dMark,
    value,
    metadata: null,
  } as ProductBenchmark;
}

function getG2dMark($: cheerio.CheerioAPI): ProductBenchmark {
  const g2dMark = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Average G2D Mark:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = g2dMark ? Number(g2dMark) : null;
  return {
    benchmarkKey: BenchmarKey.G2dMark,
    value,
    metadata: null,
  } as ProductBenchmark;
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
  ctx: ScraperContext,
): GpuField<MarketSegment> {
  const text = $('.desc-foot p strong')
    .filter((_i, strong) => $(strong).text().trim() === 'Videocard Category:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  let raw: MarketSegment = null;
  if (text === 'Desktop') {
    raw = MarketSegment.Desktop;
  } else if (text === 'Mobile') {
    raw = MarketSegment.Mobile;
  } else if (text === 'Workstation') {
    raw = MarketSegment.Workstation;
  }
  const formatted = raw != null ? formatMarketSegment(raw) : raw;

  return createGpuField({ field: 'marketSegment', raw, formatted, ctx });
}
