import * as cheerio from 'cheerio';
import { scraper } from '../scraper';
import { parseGpuName } from './utils';

export interface TechPowerUpRetailModelSource {
  name?: string;
  company?: string;
  url?: string;
}

export interface ScrapeTechPowerRetailModelUrlsOptions {
  url: string;
  noProxy?: boolean;
}

// Example: https://www.techpowerup.com/gpu-specs/geforce-rtx-3090.c3622
export async function scrapeTechPowerUpRetailModelSources(
  options: ScrapeTechPowerRetailModelUrlsOptions,
) {
  const { url, noProxy } = options;

  const response = await scraper.scrape(url, { retries: 1, noProxy });
  const $ = cheerio.load(response.data);

  const retailModels = getRetailModels($);
  return retailModels;
}

function getRetailModels($: cheerio.CheerioAPI) {
  const retailModelLink = $('.board-table-title__inner a');
  const sources: TechPowerUpRetailModelSource[] = [];
  retailModelLink.each((_i, el) => {
    const fullName = $(el).text().trim();
    const { company, name } = parseGpuName(fullName);
    const url = $(el).attr('href').trim();

    if (company != null) {
      sources.push({ name, company, url });
    }
  });

  return sources;
}
