import axios from 'axios';
import * as cheerio from 'cheerio';
import { getProxiedUrl } from '../utils';

export interface UlBenchmarkGpuSource {
  name: string;
  company: string;
  timespyScore: number;
  url: string;
}
export interface ScrapeUlBenchmarkGpuUrlsOptions {
  query: string;
  proxy?: boolean;
}
const SEARCH_URL = 'https://benchmarks.ul.com/compare/best-gpus?search={query}';

export async function scrapeUlBenchmarkGpuSources(
  options: ScrapeUlBenchmarkGpuUrlsOptions,
) {
  return await scrapeSearchData(options);
}

async function scrapeSearchData(options: ScrapeUlBenchmarkGpuUrlsOptions) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const gpus: UlBenchmarkGpuSource[] = [];

  const el = $('table#productTable tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);

    const $deviceEl = $tr.find('a.OneLinkNoTx');
    const url = $deviceEl.attr('href').trim();
    const { company, name } = parseGpuName($deviceEl.text().trim());

    const $scoreEl = $tr.find('span.bar-score');
    const timespyScore = Number($scoreEl.text().trim().replace(',', ''));

    gpus.push({ name, company, timespyScore, url });
  });

  return gpus;
}

async function fetchSearchPage(options: ScrapeUlBenchmarkGpuUrlsOptions) {
  const searchUrl = buildSearchUrl(options.query);
  const url = options.proxy ? getProxiedUrl(searchUrl) : searchUrl;

  const response = await axios.get(url);
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
