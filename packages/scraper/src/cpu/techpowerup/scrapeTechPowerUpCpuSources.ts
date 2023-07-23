import { parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpCpuSource } from '../types';
import { sanitizeCpuSourceName } from '../utils';

export interface ScrapeTechPowerUpCpuSourcesOptions {
  url: string;
  company?: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com';

export async function scrapeTechPowerUpCpuSources(
  options: ScrapeTechPowerUpCpuSourcesOptions,
) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const cpus: TechPowerUpCpuSource[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const { company: companyFromName, name } = parseProductName(
      $td.text().trim(),
    );
    const sanitizedName = sanitizeCpuSourceName(name);

    cpus.push({
      name: sanitizedName,
      company: companyFromName || options.company,
      url,
    });
  });

  return cpus;
}

async function fetchSearchPage(options: ScrapeTechPowerUpCpuSourcesOptions) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  return response.data;
}
