import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { PassMarkCpuSource } from '../types';
import { sanitizeCpuName } from '../utils';

export interface ScrapePassMarkCpuSourcesOptions {
  noProxy?: boolean;
}

const BASE_URL = 'https://www.cpubenchmark.net/';
const LIST_URLS = [
  'https://www.cpubenchmark.net/high_end_cpus.html', // high end
  'https://www.cpubenchmark.net/mid_range_cpus.html', // high mid range
  'https://www.cpubenchmark.net/midlow_range_cpus.html', // low mid range
  'https://www.cpubenchmark.net/low_end_cpus.html', // low end
];

// TODO: extract company from name
export async function scrapePassMarkCpuSources(
  options: ScrapePassMarkCpuSourcesOptions,
) {
  const sources: Record<string, PassMarkCpuSource> = {};

  for (const url of LIST_URLS) {
    const $ = cheerio.load(await fetchListPage(url, options));
    const el = $('.main ul.chartlist li');
    el.each((_i, li) => {
      const $li = $(li);

      const url = cleanUrl(BASE_URL + $li.find('a').attr('href').trim());
      const { company, name } = parseProductName(
        $li.find('a span.prdname').text().trim(),
      );

      const sanitizedName = sanitizeCpuName(name);
      const scoreText = $li.find('a span.count').text().trim().replace(',', '');
      const score = scoreText ? Number(scoreText) : null;

      sources[sanitizedName] = {
        name: sanitizedName,
        company,
        url,
        cpuMarkMultiThread: !Number.isNaN(score) ? score : null,
      };
    });
  }

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
