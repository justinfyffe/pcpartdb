import {
  BenchmarKey,
  CpuProduct,
  ProductBenchmark,
  ProductType,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';

export interface ScrapeGeekBenchCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://browser.geekbench.com/processors/intel-core-i9-10900kf
export async function scrapeGeekBenchCpuData(
  options: ScrapeGeekBenchCpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const benchmarks: ProductBenchmark[] = [
    getSingleCoreScore($),
    getMultiCoreScore($),
  ].filter((value) => value != null);

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getSingleCoreScore($: cheerio.CheerioAPI): ProductBenchmark {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'single-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());
  return {
    benchmarkKey: BenchmarKey.GeekBenchSingleCore,
    value,
    metadata: null,
  };
}

function getMultiCoreScore($: cheerio.CheerioAPI): ProductBenchmark {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'multi-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return {
    benchmarkKey: BenchmarKey.GeekBenchMultiCore,
    value,
    metadata: null,
  };
}
