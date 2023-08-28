import { Gpu, GpuField, ScrapeProductResponse } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createGpuField } from '../utils';

export interface ScrapeUlBenchmarksGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function scrapeUlBenchmarksGpuData(
  options: ScrapeUlBenchmarksGpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Gpu> = {
    timespyGraphics: getTimespyGraphics($, ctx),
  };

  return { product } as ScrapeProductResponse;
}

function getTimespyGraphics(
  $: cheerio.CheerioAPI,
  ctx: ScraperContext,
): GpuField<number> {
  const timespyGraphics = $('.result-pimp-badge-score-item').first().text();

  const value = timespyGraphics ? Number(timespyGraphics) : null;
  return createGpuField({ field: 'timespyGraphics', value, ctx });
}
