import { scrapeGeekBenchCpuSources as scrapeCpuSources } from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { sleep } from '../../shared/process';
import { geekBenchPath } from './utils';

const SLEEP_DELAY = 10_000;

interface ScrapeGeekBenchCpuSourcesOptions {
  noProxy?: boolean;
}

export async function scrapeGeekBenchCpuSources(
  options: ScrapeGeekBenchCpuSourcesOptions,
) {
  console.log('Scraping CPU Sources from GeekBench');

  const sources = await scrapeCpuSources(options);
  await sleep(SLEEP_DELAY);
  console.log(`Scraped ${sources.length} sources`);

  const path = geekBenchPath('sources.json');
  const timestampPath = geekBenchPath(`sources-${yyyyMmDd()}.json`);

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

  console.log(`Finished scraping GeekBench CPU sources. Saved to ${path}`);

  return sources;
}
