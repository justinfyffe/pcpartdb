import axios from 'axios';
import * as cheerio from 'cheerio';

export interface UlBenchmarkGpuUrl {
  name: string;
  company: string;
  timespyScore: number;
  url: string;
}
export interface ScrapeUlBenchmarkGpuUrlsOptions {
  query: string;
}
const SEARCH_URL = 'https://benchmarks.ul.com/compare/best-gpus?search={query}';

export async function scrapeUlBenchmarkGpuUrls(
  options: ScrapeUlBenchmarkGpuUrlsOptions,
) {
  return await scrapeSearchData(options.query);
}

async function scrapeSearchData(query: string) {
  const $ = cheerio.load(await fetchSearchPage(query));

  const gpus: UlBenchmarkGpuUrl[] = [];

  const el = $('table#productTable tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);

    const $deviceEl = $tr.find('a.OneLinkNoTx');
    const url = $deviceEl.attr('href');
    const { company, name } = parseGpuName($deviceEl.text().trim());

    const $scoreEl = $tr.find('span.bar-score');
    const timespyScore = Number($scoreEl.text().trim().replace(',', ''));

    gpus.push({ name, company, timespyScore, url });
  });

  return gpus;
}

async function fetchSearchPage(query: string) {
  const url = buildSearchUrl(query);
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
