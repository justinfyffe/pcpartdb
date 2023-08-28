import { Cpu, ScrapeProductResponse } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

export interface ScrapePassMarkCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://www.cpubenchmark.net/cpu.php?cpu=AMD+EPYC+9654&id=5088
export async function scrapePassMarkCpuData(
  options: ScrapePassMarkCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    cpuMarkMultiThread: getMultiThreadScore($, ctx),
    cpuMarkSingleThread: getSingleThreadScore($, ctx),
  };

  return { product } as ScrapeProductResponse;
}

function getMultiThreadScore($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const cpuMarkMultiThread = $('.speedicon').siblings('span').first().text();

  const value = cpuMarkMultiThread ? Number(cpuMarkMultiThread) : null;
  return createCpuField({ field: 'cpuMarkMultiThread', value, ctx });
}

function getSingleThreadScore($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const singleThreadScore = $('strong')
    .filter((_i, el) => $(el).text().trim() === 'Single Thread Rating:')
    .parent()
    .contents()
    .filter((_i, el) => el.type === 'text' && el.nodeValue.trim() !== '')
    .first()
    .text()
    .trim();

  const value = singleThreadScore ? Number(singleThreadScore) : null;
  return createCpuField({ field: 'cpuMarkSingleThread', value, ctx });
}
