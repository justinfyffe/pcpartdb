import {
  BenchmarKey,
  GpuProduct,
  ProductBenchmark,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';

export interface ScrapeUlBenchmarksGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://benchmarks.ul.com/hardware/gpu/NVIDIA%20GeForce%20RTX%204090+review
export async function scrapeUlBenchmarksGpuData(
  options: ScrapeUlBenchmarksGpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const benchmarks: ProductBenchmark[] = [getTimeSpyGraphics($)].filter(
    (value) => value != null,
  );

  const product: Partial<GpuProduct> = {
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getTimeSpyGraphics($: cheerio.CheerioAPI): ProductBenchmark {
  const timespyGraphics = $('.result-pimp-badge-score-item').first().text();

  const value = timespyGraphics ? Number(timespyGraphics) : null;
  return {
    benchmarkKey: BenchmarKey.TimespyGraphics,
    value,
    metadata: null,
  } as ProductBenchmark;
}
