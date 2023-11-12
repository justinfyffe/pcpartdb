import { cleanUrl, SubProductType } from '@pcpartdb/shared';
import * as cheerio from 'cheerio';
import { scraper } from '../../scraper';
import { TechPowerUpGpuRetailModelSource } from '../types';
import { generateGpuGroupKey } from '../utils';
import { parseTechPowerUpGpuName } from './utils';

export interface scrapeTechPowerUpGpuRetailModelSourcesOptions {
  url: string;
  noProxy?: boolean;
}

const BASE_URL = 'https://www.techpowerup.com/';

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpGpuRetailModelSources(
  options: scrapeTechPowerUpGpuRetailModelSourcesOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrapeGet(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const retailModels = getRetailModels($);
  return retailModels;
}

function getRetailModels($: cheerio.CheerioAPI) {
  const retailModelLink = $('.board-table-title__inner a');
  const sources: TechPowerUpGpuRetailModelSource[] = [];
  retailModelLink.each((_i, el) => {
    const fullName = $(el).text().trim();
    const { company, name } = parseTechPowerUpGpuName(fullName);
    const url = cleanUrl(BASE_URL + $(el).attr('href').trim());

    const externalKey = getExternalKey(url);
    if (company && externalKey) {
      const groupKey = generateGpuGroupKey({
        gpuType: SubProductType.GpuRetailModel,
        name,
        company,
      });
      sources.push({ groupKey, externalKey, name, company, url });
    }
  });

  return sources;
}

function getExternalKey(url: string) {
  const keyIndex = url.lastIndexOf('.');
  const externalKey = url.substring(keyIndex).trim();
  return externalKey;
}
