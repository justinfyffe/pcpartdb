import { cleanUrl, parseProductName, SubProductType } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpGpuSource } from '../types';
import { generateGpuGroupKey } from '../utils';

export interface ScrapeTechPowerUpGpuUrlsOptions {
  url: string;
  company?: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com/';

export async function scrapeTechPowerUpGpuSources(
  options: ScrapeTechPowerUpGpuUrlsOptions,
) {
  return await scrapeSearchData(options);
}

async function scrapeSearchData(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const $ = cheerio.load(await fetchSearchPage(options));

  const sources: TechPowerUpGpuSource[] = [];

  const el = $('table tbody tr td:first-child');
  el.each((i, td) => {
    const $td = $(td);

    const url = cleanUrl(BASE_URL + $td.find('a').attr('href').trim());
    const { company: companyFromName, name } = parseProductName(
      $td.text().trim(),
    );

    const company = companyFromName || options.company;
    const externalKey = getExternalKey(url);
    if (company) {
      const groupKey = generateGpuGroupKey({
        gpuType: SubProductType.GpuChipset,
        name,
        company,
      });
      sources.push({ groupKey, externalKey, name, company, url });
    }
  });

  return sources;
}

async function fetchSearchPage(options: ScrapeTechPowerUpGpuUrlsOptions) {
  const { url, noProxy } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  return response.data;
}

function getExternalKey(url: string) {
  const keyIndex = url.lastIndexOf('.');
  const externalKey = url.substring(keyIndex).trim();
  return externalKey;
}
