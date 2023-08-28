import {
  Gpu,
  GpuField,
  GpuMarketSegmentValue,
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

  const product: Partial<Gpu> = {
    marketSegment: getMarketSegment($, ctx),
    g3dMark: getG3dMark($, ctx),
    g2dMark: getG2dMark($, ctx),
  };

  return { product } as ScrapeProductResponse;
}

function getG3dMark(
  $: cheerio.CheerioAPI,
  ctx: ScraperContext,
): GpuField<number> {
  const g3dMark = $('.speedicon').siblings('span').first().text();
  const value = g3dMark ? Number(g3dMark) : null;
  return createGpuField({ field: 'g3dMark', value, ctx });
}

function getG2dMark(
  $: cheerio.CheerioAPI,
  ctx: ScraperContext,
): GpuField<number> {
  const g2dMark = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Average G2D Mark:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = g2dMark ? Number(g2dMark) : null;
  return createGpuField({ field: 'g2dMark', value, ctx });
}

function getMarketSegment(
  $: cheerio.CheerioAPI,
  ctx: ScraperContext,
): GpuField<GpuMarketSegmentValue> {
  const text = $('.desc-foot p strong')
    .filter((_i, strong) => $(strong).text().trim() === 'Videocard Category:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  let value: GpuMarketSegmentValue = null;
  if (text === 'Desktop') {
    value = GpuMarketSegmentValue.Desktop;
  } else if (text === 'Mobile') {
    value = GpuMarketSegmentValue.Mobile;
  } else if (text === 'Workstation') {
    value = GpuMarketSegmentValue.Workstation;
  }

  return createGpuField({ field: 'marketSegment', value, ctx });
}
