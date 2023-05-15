import { scrapeTechPowerUpRetailModelSources } from '@pcpartdb/scraper';
import { cleanUrl, MarketSegmentValue } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { RetailModelSource } from './types';

interface FetchRetailModelSourcesOptions {
  sourcesPath: string;
  chipsetId: number;
  marketSegment: MarketSegmentValue;
  techPowerUpUrl: string;
  proxy?: boolean;
}

export async function fetchRetailModelSources(
  options: FetchRetailModelSourcesOptions,
) {
  console.log('Scraping Retail Model Sources from TechPowerUp');

  const { sourcesPath, chipsetId, marketSegment, techPowerUpUrl, proxy } =
    options;

  const rawSources = await scrapeTechPowerUpRetailModelSources({
    url: techPowerUpUrl,
    proxy,
  });
  const sources: RetailModelSource[] = rawSources.map((source) => ({
    chipsetId,
    marketSegment,
    techPowerUpUrl: cleanUrl(`https://www.techpowerup.com/${source.url}`),
    name: source.name,
    company: source.company,
  }));

  console.log(`Scraped ${sources.length} sources`);

  console.log(`Finished scraping sources. Saving to ${sourcesPath}`);
  await fsPromises.writeFile(
    sourcesPath,
    JSON.stringify(sources, undefined, 2),
    'utf-8',
  );

  return sources;
}
