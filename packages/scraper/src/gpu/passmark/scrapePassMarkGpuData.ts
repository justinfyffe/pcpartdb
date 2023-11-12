import {
  BenchmarkKey,
  GpuFields,
  GpuProduct,
  ProductBenchmark,
  ProductType,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions } from '../../types';

export interface ScrapePassMarkGpuDataOptions extends CommonScraperOptions {
  url: string;
}

// TODO: scrape fields
// Example: https://www.videocardbenchmark.net/gpu.php?gpu=GeForce+RTX+4090&id=4606
export async function scrapePassMarkGpuData(
  options: ScrapePassMarkGpuDataOptions,
) {
  const { url, noProxy, ctx: _ctx } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const fields: GpuFields = {};

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
    benchmarkKey: BenchmarkKey.PassMark_G3dMark,
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
    benchmarkKey: BenchmarkKey.PassMark_G2dMark,
    value,
    metadata: null,
  } as ProductBenchmark;
}
