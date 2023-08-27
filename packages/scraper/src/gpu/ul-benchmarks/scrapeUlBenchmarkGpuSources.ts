import { GpuProductType } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { UlBenchmarkGpuSource } from '../types';
import { generateGpuGroupKey } from '../utils';

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

  const sources: UlBenchmarkGpuSource[] = [];

  const el = $('table#productTable tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);

    const $deviceEl = $tr.find('a.OneLinkNoTx');
    const url = $deviceEl.attr('href').trim();
    const { company, name } = parseGpuName($deviceEl.text().trim());

    const $scoreEl = $tr.find('span.bar-score');
    const timespyScore = Number($scoreEl.text().trim().replace(',', ''));

    const externalKey = getExternalKey(url);
    if (company && externalKey) {
      const groupKey = generateGpuGroupKey({
        gpuType: GpuProductType.Chipset,
        name,
        company,
      });
      sources.push({ groupKey, externalKey, name, company, timespyScore, url });
    }
  });

  return sources;
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
  const lcCompany = company.toLowerCase();
  if (
    lcCompany === 'amd' ||
    lcCompany === 'intel' ||
    lcCompany === 'nvidia' ||
    lcCompany === 'ati'
  ) {
    return { company, name };
  }

  return { company: null, name: null };
}

function getExternalKey(url: string) {
  const startIndex = url.lastIndexOf('/') + 1;
  const endIndex = url.lastIndexOf('+review');
  if (endIndex <= startIndex) {
    return null;
  }

  return url.substring(startIndex, endIndex);
}
