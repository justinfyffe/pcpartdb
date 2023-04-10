import {
  GpuBenchmarks,
  GpuDataSourceKey,
  GpuField,
  ScrapeGpuDetailsResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../scraper';

export interface ScrapeUlBenchmarksGpuDetailsOptions {
  url: string;
  proxy?: boolean;
}

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function scrapeUlBenchmarksGpuDetails(
  options: ScrapeUlBenchmarksGpuDetailsOptions,
) {
  const response = await scraper.scrape(options.url, { retries: 1 });
  const $ = cheerio.load(response.data);

  // Get Benchmark Values
  const benchmarks: GpuBenchmarks = {
    timespyGraphics: getTimespyGraphics($),
  };

  return { gpu: { benchmarks } } as ScrapeGpuDetailsResponse;
}

function getTimespyGraphics($: cheerio.CheerioAPI): GpuField<number> {
  const timespyGraphics = $('.result-pimp-badge-score-item').first().text();

  const value = timespyGraphics ? Number(timespyGraphics) : null;
  return {
    value,
    meta: {
      fieldKey: 'timespyGraphics',
      source: GpuDataSourceKey.UlBenchmarks,
      autoUpdate: true,
    },
  };
}
