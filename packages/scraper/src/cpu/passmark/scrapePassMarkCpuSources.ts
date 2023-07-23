import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { PassMarkCpuSource } from '../types';
import { sanitizeCpuSourceName } from '../utils';

export interface ScrapePassMarkCpuSourcesOptions {
  url: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.cpubenchmark.net/';

export async function scrapePassMarkCpuSources(
  options: ScrapePassMarkCpuSourcesOptions,
) {
  const { url } = options;
  const sources: Record<string, PassMarkCpuSource> = {};

  const $ = cheerio.load(await fetchListPage(url, options));
  const el = $('.main ul.chartlist li');
  el.each((_i, li) => {
    const $li = $(li);

    const url = cleanUrl(BASE_URL + $li.find('a').attr('href').trim());
    const { company, name } = parseProductName(
      $li.find('a span.prdname').text().trim(),
    );

    const sanitizedName = sanitizeCpuSourceName(name);
    const scoreText = $li.find('a span.count').text().trim().replace(',', '');
    const score = scoreText ? Number(scoreText) : null;

    sources[sanitizedName] = {
      name: sanitizedName,
      company,
      url,
      cpuMarkMultiThread: !Number.isNaN(score) ? score : null,
    };
  });

  return Object.values(sources);
}

async function fetchListPage(
  url: string,
  options: ScrapePassMarkCpuSourcesOptions,
) {
  const { noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  return response.data;
}
