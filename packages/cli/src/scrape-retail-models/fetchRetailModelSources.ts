import { scrapeTechPowerUpGpuRetailModelSources } from '@pcpartdb/scraper';
import { cleanUrl, GpuMarketSegmentValue } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { RetailModelSource } from './types';

interface FetchRetailModelSourcesOptions {
  sourcesPath: string;
  chipsetId: number;
  marketSegment: GpuMarketSegmentValue;
  techPowerUpUrl: string;
  noProxy?: boolean;
}

export async function fetchRetailModelSources(
  options: FetchRetailModelSourcesOptions,
) {
  console.log('Scraping Retail Model Sources from TechPowerUp');

  const { sourcesPath, chipsetId, marketSegment, techPowerUpUrl, noProxy } =
    options;

  const rawSources = await scrapeTechPowerUpGpuRetailModelSources({
    url: techPowerUpUrl,
    noProxy,
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
