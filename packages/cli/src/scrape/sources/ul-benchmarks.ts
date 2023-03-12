import {
  scrapeUlBenchmarkGpuSources as scrapeGpuSources,
  UlBenchmarkGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { sleep } from '../../shared/process';
import { ulBenchmarksDataPath } from '../utils';

const QUERIES = ['a', 'b'];
// const QUERIES = [
//   'a',
//   'b',
//   'c',
//   'd',
//   'e',
//   'f',
//   'g',
//   'h',
//   'i',
//   'j',
//   'k',
//   'l',
//   'm',
//   'n',
//   'o',
//   'p',
//   'q',
//   'r',
//   's',
//   't',
//   'u',
//   'v',
//   'w',
//   'x',
//   'y',
//   'z',
//   'intel',
//   'amd',
//   'nvidia',
// ];

const SLEEP_DELAY = 30_000;

export async function scrapeUlBenchmarkGpuSources() {
  console.log('Scraping GPU Sources from UL Benchmarks');

  const map: Record<string, UlBenchmarkGpuSource> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const query = QUERIES[i];
    console.log(`Scraping query: ${query}`);
    const gpusForQuery = await scrapeGpuSources({ query });
    console.log(`Scraped ${gpusForQuery.length}`);
    gpusForQuery.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
    await sleep(SLEEP_DELAY);
  }

  const gpus = Object.values(map);
  console.log(`Scraped ${gpus.length} total sources`);

  const path = ulBenchmarksDataPath('gpu-sources.json');
  const timestampPath = ulBenchmarksDataPath(
    `gpu-sources-${new Date().getTime()}.json`,
  );
  console.log(
    `Finished scraping sources. Saving to ${path} and ${timestampPath}`,
  );
  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
  await fsPromises.writeFile(
    timestampPath,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}
