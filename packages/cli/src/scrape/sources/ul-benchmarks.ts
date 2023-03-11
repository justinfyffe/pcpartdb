import {
  scrapeUlBenchmarkGpuSources as scrapeGpuSources,
  UlBenchmarkGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { sleep } from '../../shared/process';
import { ulBenchmarksDataPath } from '../utils';

const QUERIES = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'intel',
  'amd',
  'nvidia',
];

const SLEEP_DELAY = 5_000;

export async function scrapeUlBenchmarkGpuSources() {
  const map: Record<string, UlBenchmarkGpuSource> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const gpusForQuery = await scrapeGpuSources({ query: QUERIES[0] });
    gpusForQuery.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
    await sleep(SLEEP_DELAY);
  }

  const gpus = Object.values(map);

  await fsPromises.writeFile(
    ulBenchmarksDataPath('gpu-sources.json'),
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}
