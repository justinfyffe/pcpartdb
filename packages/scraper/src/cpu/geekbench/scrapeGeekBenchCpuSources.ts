import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import deepmerge from 'deepmerge';
import { scraper } from '../../scraper';
import { GeekBenchCpuSource } from '../types';

export interface ScrapeGeekBenchCpuSourcesOptions {
  noProxy?: boolean;
}

const BASE_URL = 'https://browser.geekbench.com/';
const URL = 'https://browser.geekbench.com/processor-benchmarks';

export async function scrapeGeekBenchCpuSources(
  options: ScrapeGeekBenchCpuSourcesOptions,
) {
  const $ = cheerio.load(await fetchListPage(options));

  const singleThreadSources = parseSingleCoreTable($);
  const multiThreadSources = parseMultiCoreTable($);

  const combined = deepmerge(singleThreadSources, multiThreadSources);
  return Object.values(combined);
}

function parseSingleCoreTable($: cheerio.CheerioAPI) {
  const sources: Record<string, GeekBenchCpuSource> = {};

  const el = $('#single-core table tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);
    const $name = $tr.find('td.name a');

    const { company, name } = parseProductName($name.text().trim());
    const url = cleanUrl(BASE_URL + $name.attr('href').trim());
    const scoreText = $tr.find('td.score').text().trim().replace(',', '');
    const score = scoreText ? Number(scoreText) : null;

    sources[name] = { name, company, url, geekBenchSingleCore: score };
  });

  return sources;
}

function parseMultiCoreTable($: cheerio.CheerioAPI) {
  const sources: Record<string, GeekBenchCpuSource> = {};

  const el = $('#multi-core table tbody tr');
  el.each((_i, tr) => {
    const $tr = $(tr);
    const $name = $tr.find('td.name a');

    const { company, name } = parseProductName($name.text().trim());
    const url = cleanUrl(BASE_URL + $name.attr('href').trim());
    const scoreText = $tr.find('td.score').text().trim().replace(',', '');
    const score = scoreText ? Number(scoreText) : null;

    sources[name] = { name, company, url, geekBenchMultiCore: score };
  });

  return sources;
}

async function fetchListPage(options: ScrapeGeekBenchCpuSourcesOptions) {
  const { noProxy } = options;

  const response = await scraper.scrape(URL, { retries: 1, noProxy });
  return response.data;
}
