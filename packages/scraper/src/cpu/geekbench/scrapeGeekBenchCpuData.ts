import { Cpu, ScrapeProductResponse } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { CommonScraperOptions, ScraperContext } from '../../types';
import { createCpuField } from '../utils';

export interface ScrapeGeekBenchCpuDataOptions extends CommonScraperOptions {
  url: string;
}

// Example: https://browser.geekbench.com/processors/intel-core-i9-10900kf
export async function scrapeGeekBenchCpuData(
  options: ScrapeGeekBenchCpuDataOptions,
) {
  const { url, noProxy, ctx } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const product: Partial<Cpu> = {
    geekbenchSingleCore: getSingleCoreScore($, ctx),
    geekbenchMultiCore: getMultiCoreScore($, ctx),
  };

  return { product } as ScrapeProductResponse;
}

function getSingleCoreScore($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'single-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return createCpuField({ field: 'geekbenchSingleCore', value, ctx });
}

function getMultiCoreScore($: cheerio.CheerioAPI, ctx?: ScraperContext) {
  const el = $('.score-container .note')
    .filter(
      (_i, div) => $(div).text().trim().toLowerCase() === 'multi-core score',
    )
    .siblings('.score')
    .first();
  const value = Number(el.text());

  return createCpuField({ field: 'geekbenchMultiCore', value, ctx });
}
