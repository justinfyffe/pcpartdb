import axios from 'axios';
import * as cheerio from 'cheerio';

export interface TechPowerUpGpuUrl {
  name: string;
  company: string;
  url: string;
}

export interface ScrapeTechPowerUpGpuUrlsOptions {
  query: string;
}

const BASE_URL = 'https://www.techpowerup.com';
const SEARCH_URL =
  'https://www.techpowerup.com/gpu-specs/?ajaxsrch={query}&_={timestamp}';

export async function scrapeTechPowerUpGpuUrls(
  options: ScrapeTechPowerUpGpuUrlsOptions,
) {
  return await scrapeSearchData(options.query);
}

async function scrapeSearchData(query: string) {
  const $ = cheerio.load(await fetchSearchPage(query));

  const gpus: TechPowerUpGpuUrl[] = [];

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

async function fetchSearchPage(query: string) {
  const url = buildSearchUrl(query);
  const response = await axios.get(url);
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', encodeURIComponent(query)).replace(
    '{timestamp}',
    `${new Date().getTime()}`,
  );
}
