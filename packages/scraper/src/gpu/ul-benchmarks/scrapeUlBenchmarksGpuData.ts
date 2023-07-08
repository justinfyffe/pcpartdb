import { Gpu, GpuField, ScrapeProductResponse } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';

export interface ScrapeUlBenchmarksGpuDataOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function scrapeUlBenchmarksGpuData(
  options: ScrapeUlBenchmarksGpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Gpu> = {
    timespyGraphics: getTimespyGraphics($),
  };

  return { product } as ScrapeProductResponse;
}

function getTimespyGraphics($: cheerio.CheerioAPI): GpuField<number> {
  const timespyGraphics = $('.result-pimp-badge-score-item').first().text();

  const value = timespyGraphics ? Number(timespyGraphics) : null;
  return {
    value,
    meta: { fieldKey: 'timespyGraphics', autoUpdate: true },
  };
}
