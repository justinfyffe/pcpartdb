import { parseProductName } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpCpuSource } from '../types';
import { generateCpuGroupKey } from '../utils';

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

  const sources: TechPowerUpCpuSource[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const url = BASE_URL + $td.find('a').attr('href').trim();
    const { company: companyFromName, name } = parseProductName(
      $td.text().trim(),
    );

    const company = companyFromName || options.company;
    const externalKey = getExternalKey(url);
    if (company && externalKey) {
      const groupKey = generateCpuGroupKey({ company, name });
      sources.push({ groupKey, externalKey, name, company, url });
    }
  });

  return sources;
}

async function fetchSearchPage(options: ScrapeTechPowerUpCpuSourcesOptions) {
  const { url, noProxy } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  return response.data;
}

function getExternalKey(url: string) {
  const keyIndex = url.lastIndexOf('.');
  const externalKey = url.substring(keyIndex).trim();
  return externalKey;
}
