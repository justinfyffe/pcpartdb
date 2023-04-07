import * as cheerio from 'cheerio';
import { scraper } from '../scraper';

export interface TechPowerUpGpuSource {
  name: string;
  company: string;
  url: string;
}

export interface ScrapeTechPowerUpGpuUrlsOptions {
  query: string;
  proxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com';
const SEARCH_URL =
  'https://www.techpowerup.com/gpu-specs/?ajaxsrch={query}&_={timestamp}';

export async function scrapeTechPowerUpGpuSources(
  options: ScrapeTechPowerUpGpuUrlsOptions,
) {
  return await scrapeSearchData(options);
}

async function scrapeSearchData(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const gpus: TechPowerUpGpuSource[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const className = $td.attr('class');
    let company = '';
    if (className === 'vendor-NVIDIA') {
      company = 'NVIDIA';
    } else if (className === 'vendor-AMD') {
      company = 'AMD';
    } else if (className === 'vendor-Intel') {
      company = 'Intel';
    }

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const name = $td.text().trim();

    gpus.push({ name, company, url });
  });

  return gpus;
}

async function fetchSearchPage(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const searchUrl = buildSearchUrl(options.query);
  const response = await scraper.scrape(searchUrl, { retries: 1 });
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', encodeURIComponent(query)).replace(
    '{timestamp}',
    `${new Date().getTime()}`,
  );
}
