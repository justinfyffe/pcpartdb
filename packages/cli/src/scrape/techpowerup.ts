import {
  scrapeTechPowerUpGpuSources as scrapeGpuUrls,
  TechPowerUpGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { sleep } from '../shared/process';
import { techPowerUpDataPath } from './utils';

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
];

const SLEEP_DELAY = 5_000;

export async function scrapeTechPowerUpGpuUrls() {
  const map: Record<string, TechPowerUpGpuSource> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const gpusForQuery = await scrapeGpuUrls({ query: QUERIES[0] });
    gpusForQuery.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
    await sleep(SLEEP_DELAY);
  }

  const gpus = Object.values(map);

  await fsPromises.writeFile(
    techPowerUpDataPath('gpu-urls.json'),
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}
