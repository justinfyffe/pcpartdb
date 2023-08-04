import { parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpGpuSource } from '../types';
import { sanitizeGpuSourceName } from '../utils';

export interface ScrapeTechPowerUpGpuUrlsOptions {
  url: string;
  company?: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com';

export async function scrapeTechPowerUpGpuSources(
  options: ScrapeTechPowerUpGpuUrlsOptions,
) {
  return await scrapeSearchData(options);
}

async function scrapeSearchData(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const gpus: TechPowerUpGpuSource[] = [];

  const el = $('table tbody tr td:first-child + td');
  el.each((i, td) => {
    const $td = $(td);

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const { company: companyFromName, name } = parseProductName(
      $td.text().trim(),
    );
    const sanitizedName = sanitizeGpuSourceName(name);

    gpus.push({
      name: sanitizedName,
      company: companyFromName || options.company,
      url,
    });
  });

  return gpus;
}

async function fetchSearchPage(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  return response.data;
}
