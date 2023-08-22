import {
  Cpu,
  CpuFieldKey,
  CpuFieldMeta,
  hasProductFieldValue,
  ScrapeProductResponse,
} from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';

export interface ScrapePassMarkCpuDataOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088
export async function scrapePassMarkCpuData(
  options: ScrapePassMarkCpuDataOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    cpuMarkMultiThread: getMultiThreadScore($),
    cpuMarkSingleThread: getSingleThreadScore($),
  };

  return { product } as ScrapeProductResponse;
}

function getMultiThreadScore($: cheerio.CheerioAPI) {
  const cpuMarkMultiThread = $('.speedicon').siblings('span').first().text();

  const value = cpuMarkMultiThread ? Number(cpuMarkMultiThread) : null;
  return createCpuField('cpuMarkMultiThread', value);
}

function getSingleThreadScore($: cheerio.CheerioAPI) {
  const singleThreadScore = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Single Thread Rating:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = singleThreadScore ? Number(singleThreadScore) : null;
  return createCpuField('cpuMarkSingleThread', value);
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
    // Arrays cannot be null
    if (!Array.isArray(productField.value)) {
      productField.value = null;
    }
  }

  return productField;
}
