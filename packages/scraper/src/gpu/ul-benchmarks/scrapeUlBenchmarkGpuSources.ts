import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { UlBenchmarkGpuSource } from '../types';
import { sanitizeGpuSourceName } from '../utils';

export interface ScrapeUlBenchmarkGpuSourcesOptions {
  query: string;
  noProxy?: boolean;
}
const SEARCH_URL = 'https://benchmarks.ul.com/compare/best-gpus?search={query}';

export async function scrapeUlBenchmarkGpuSources(
  options: ScrapeUlBenchmarkGpuSourcesOptions,
) {
  return await scrapeSearchData(options);
}

async function scrapeSearchData(options: ScrapeUlBenchmarkGpuSourcesOptions) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const gpus: UlBenchmarkGpuSource[] = [];

  const el = $('table#productTable tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);

    const $deviceEl = $tr.find('a.OneLinkNoTx');
    const url = $deviceEl.attr('href').trim();
    const { company, name } = parseGpuName($deviceEl.text().trim());
    const sanitizedName = sanitizeGpuSourceName(name);

    const $scoreEl = $tr.find('span.bar-score');
    const timespyScore = Number($scoreEl.text().trim().replace(',', ''));

    gpus.push({ name: sanitizedName, company, timespyScore, url });
  });

  return gpus;
}

async function fetchSearchPage(options: ScrapeUlBenchmarkGpuSourcesOptions) {
  const { query, noProxy } = options;

  const searchUrl = buildSearchUrl(query);
  const response = await scraper.scrape(searchUrl, { retries: 1, noProxy });
  return response.data;
}

function buildSearchUrl(query: string) {
  return SEARCH_URL.replace('{query}', encodeURIComponent(query));
}

function parseGpuName(gpuName: string) {
  const idx = gpuName.indexOf(' ');
  const company = gpuName.substring(0, idx);
  const name = gpuName.substring(idx + 1);
  if (company === 'AMD' || company === 'Intel' || company === 'NVIDIA') {
    return { company, name };
  }

  return { company: null, name: null };
}
