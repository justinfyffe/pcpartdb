import { cleanUrl, parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { PassMarkGpuSource } from '../types';
import { sanitizeGpuSourceName } from '../utils';

export interface ScrapePassMarkGpuSourcesOptions {
  noProxy?: boolean;
}

const BASE_URL = 'https://www.videocardbenchmark.net/';
const LIST_URLS = [
  'https://www.videocardbenchmark.net/high_end_gpus.html', // high end
  'https://www.videocardbenchmark.net/mid_range_gpus.html', // high mid range
  'https://www.videocardbenchmark.net/midlow_range_gpus.html', // low mid range
  'https://www.videocardbenchmark.net/low_end_gpus.html', // low end
];

export async function scrapePassMarkGpuSources(
  options: ScrapePassMarkGpuSourcesOptions,
) {
  const sources: Record<string, PassMarkGpuSource> = {};

  for (const url of LIST_URLS) {
    const $ = cheerio.load(await fetchListPage(url, options));
    const el = $('.main ul.chartlist li');
    el.each((_i, li) => {
      const $li = $(li);

      const url = cleanUrl(BASE_URL + $li.find('a').attr('href').trim());
      const { company, name } = parseProductName(
        $li.find('a span.prdname').text().trim(),
      );

      const sanitizedName = sanitizeGpuSourceName(name);
      const scoreText = $li.find('a span.count').text().trim().replace(',', '');
      const score = scoreText ? Number(scoreText) : null;

      sources[sanitizedName] = {
        name: sanitizedName,
        company,
        url,
        g3dMark: !Number.isNaN(score) ? score : null,
      };
    });
  }

  return Object.values(sources);
}

async function fetchListPage(
  url: string,
  options: ScrapePassMarkGpuSourcesOptions,
) {
  const { noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  return response.data;
}
