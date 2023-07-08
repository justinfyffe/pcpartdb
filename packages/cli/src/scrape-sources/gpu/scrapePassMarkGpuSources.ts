import { scrapePassMarkGpuSources as scrapeGpuSources } from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { sleep } from '../../shared/process';
import { passMarkPath } from './utils';

const SLEEP_DELAY = 10_000;

interface ScrapePassMarkGpuSourcesOptions {
  noProxy?: boolean;
}

export async function scrapePassMarkGpuSources(
  options: ScrapePassMarkGpuSourcesOptions,
) {
  console.log('Scraping GPU Sources from PassMark');

  const sources = await scrapeGpuSources(options);
  await sleep(SLEEP_DELAY);
  console.log(`Scraped ${sources.length} sources`);

  const path = passMarkPath('sources.json');
  const timestampPath = passMarkPath(`sources-${yyyyMmDd()}.json`);

  await fsPromises.writeFile(
    path,
    JSON.stringify(sources, undefined, 2),
    'utf-8',
  );
  await fsPromises.writeFile(
    timestampPath,
    JSON.stringify(sources, undefined, 2),
    'utf-8',
  );

  console.log(`Finished scraping PassMark GPU sources. Saved to ${path}`);

  return sources;
}
