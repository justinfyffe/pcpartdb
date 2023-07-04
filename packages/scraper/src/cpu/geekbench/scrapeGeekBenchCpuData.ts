import {
  Cpu,
  CpuFieldKey,
  CpuFieldMeta,
  hasProductFieldValue,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';

export interface ScrapeGeekBenchCpuDataOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://browser.geekbench.com/processors/intel-core-i9-10900kf
export async function scrapeGeekBenchCpuData(
  options: ScrapeGeekBenchCpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    geekbenchSingleCore: getSingleCoreScore($),
    geekbenchMultiCore: getMultiCoreScore($),
  };

  return { product } as ScrapeProductResponse;
}

function getSingleCoreScore($: cheerio.CheerioAPI) {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'single-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return createCpuField('geekbenchSingleCore', value);
}

function getMultiCoreScore($: cheerio.CheerioAPI) {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'multi-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return createCpuField('geekbenchMultiCore', value);
}

function createCpuField<T = unknown>(
  fieldKey: CpuFieldKey,
  value: T,
  meta?: CpuFieldMeta,
) {
  const productField = {
    value,
    meta: { ...(meta ?? {}), fieldKey, autoUpdate: true },
  };

  if (!hasProductFieldValue(productField)) {
    productField.value = null;
  }

  return productField;
}
