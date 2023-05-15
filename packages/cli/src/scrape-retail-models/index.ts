import { MarketSegmentValue } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { fetchRetailModelSources } from './fetchRetailModelSources';
import { scrapeRetailModels } from './scrapeRetailModels';
import { RetailModelSources } from './types';
import { sourcesDataPath } from './utils';

export type ScrapeRetailModelCommandArgs = {
  sourcesOnly?: boolean;
  dataOnly?: boolean;

  chipsetId?: string;
  marketSegment?: string;
  techPowerUpUrl?: string;

  segments?: string;
  proxy?: boolean;
};

export async function scrapeRetailModelsCommand(
  args: ScrapeRetailModelCommandArgs,
) {
  console.log(`Scraping retail models with args=${JSON.stringify(args)}`);
  const { sourcesOnly, dataOnly, techPowerUpUrl, proxy } = args;

  const chipsetId = args.chipsetId != null ? Number(args.chipsetId) : null;
  const segments = args.segments != null ? Number(args.segments) : 25;
  const marketSegment =
    args.marketSegment != null
      ? (args.marketSegment as MarketSegmentValue)
      : null;

  const sourcesPath = sourcesDataPath(`sources-${chipsetId}.json`);
  let sources: RetailModelSources = [];

  // Scrape source urls from TechPowerUp
  if (!dataOnly) {
    // Check for required inputs to fetch sources
    if (chipsetId == null || marketSegment == null || techPowerUpUrl == null) {
      throw new Error('Missing required inputs to get sources');
    }
    if (!Object.values(MarketSegmentValue).includes(marketSegment)) {
      throw new Error('Invalid market segment');
    }

    // Fetch source urls
    sources = await fetchRetailModelSources({
      chipsetId,
      marketSegment,
      techPowerUpUrl,
      proxy,
      sourcesPath,
    });
  } else {
    const file = sourcesPath;
    sources = JSON.parse(await fsPromises.readFile(file, 'utf-8'));
  }

  // Scrape data from each retail model
  if (!sourcesOnly) {
    await scrapeRetailModels({ sources, segments, proxy });
  }
}
