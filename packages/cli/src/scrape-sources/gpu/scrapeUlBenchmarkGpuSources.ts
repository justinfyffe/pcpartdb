import {
  scrapeUlBenchmarkGpuSources as scrapeGpuSources,
  UlBenchmarkGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { sleep } from '../../shared/process';
import { ulBenchmarksPath } from './utils';

const QUERIES = [
  'amd',
  'nvidia',
  'intel',
  'geforce',
  'rtx',
  'radeon',
  'gtx',
  'quadro',
  'titan',
  'vega',
  'arc',
  'firepro',
  'grid',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

const SLEEP_DELAY = 30_000;

interface ScrapeUlBenchmarkGpuSources {
  noProxy?: boolean;
}

export async function scrapeUlBenchmarkGpuSources(
  options: ScrapeUlBenchmarkGpuSources,
) {
  console.log('Scraping GPU Sources from UL Benchmarks');

  const map: Record<string, UlBenchmarkGpuSource> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const query = QUERIES[i];
    console.log(`Scraping query: ${query}`);
    try {
      const gpusForQuery = await scrapeGpuSources({ ...options, query });
      console.log(`Scraped ${gpusForQuery.length}`);
      gpusForQuery.forEach((gpu) => {
        map[gpu.name] = gpu;
      });
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }
    await sleep(SLEEP_DELAY);
  }

  const gpus = Object.values(map);
  console.log(`Scraped ${gpus.length} total sources`);

  const path = ulBenchmarksPath('sources.json');
  const timestampPath = ulBenchmarksPath(`sources-${yyyyMmDd()}.json`);

  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
  await fsPromises.writeFile(
    timestampPath,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  console.log(
    `Finished scraping sources. Saved to ${path} and ${timestampPath}`,
  );

  return gpus;
}
