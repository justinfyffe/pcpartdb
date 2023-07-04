import { parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpCpuSource } from '../types';

export interface ScrapeTechPowerUpCpuSourcesOptions {
  query: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com';
const SEARCH_URL =
  'https://www.techpowerup.com/cpu-specs/?ajaxsrch={query}&_={timestamp}';

export async function scrapeTechPowerUpCpuSources(
  options: ScrapeTechPowerUpCpuSourcesOptions,
) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const cpus: TechPowerUpCpuSource[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const { company, name } = parseProductName($td.text().trim());

    cpus.push({ name, company, url });
  });

  return cpus;
}

async function fetchSearchPage(options: ScrapeTechPowerUpCpuSourcesOptions) {
  const { query, noProxy } = options;

  const searchUrl = SEARCH_URL.replace(
    '{query}',
    encodeURIComponent(query),
  ).replace('{timestamp}', `${new Date().getTime()}`);

  const response = await scraper.scrape(searchUrl, { retries: 1, noProxy });
  return response.data;
}
