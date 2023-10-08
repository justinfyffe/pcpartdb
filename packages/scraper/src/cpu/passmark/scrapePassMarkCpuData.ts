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

export interface ScrapePassMarkCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088
export async function scrapePassMarkCpuData(
  options: ScrapePassMarkCpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const benchmarks: ProductBenchmark[] = [
    getMultiThreadScore($),
    getSingleThreadScore($),
  ].filter((value) => value != null);

  const product: Partial<CpuProduct> = {
    productType: ProductType.Cpu,
    benchmarks,
  };

  return { product } as ScrapeProductResponse;
}

function getMultiThreadScore($: cheerio.CheerioAPI): ProductBenchmark {
  const cpuMarkMultiThread = $('.speedicon').siblings('span').first().text();

  const value = cpuMarkMultiThread ? Number(cpuMarkMultiThread) : null;
  return {
    benchmarkKey: BenchmarKey.CpuMarkMultiThread,
    value,
    metadata: null,
  };
}

function getSingleThreadScore($: cheerio.CheerioAPI): ProductBenchmark {
  const singleThreadScore = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Single Thread Rating:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = singleThreadScore ? Number(singleThreadScore) : null;
  return {
    benchmarkKey: BenchmarKey.CpuMarkSingleThread,
    value,
    metadata: null,
  };
}
