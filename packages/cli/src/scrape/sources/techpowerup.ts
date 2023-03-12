import {
  scrapeTechPowerUpGpuSources as scrapeGpuSources,
  TechPowerUpGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { sleep } from '../../shared/process';
import { techPowerUpDataPath } from '../utils';

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
// ];

const SLEEP_DELAY = 30_000;

export async function scrapeTechPowerUpGpuSources() {
  console.log('Scraping GPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpGpuSource> = {};
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
  console.log(`Scraped ${gpus.length} sources`);

  const path = techPowerUpDataPath('gpu-sources.json');
  const timestampPath = techPowerUpDataPath(
    `gpu-sources-${new Date().getTime()}.json`,
  );
  console.log(`Finished scraping sources. Saving to ${path}`);
  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
  await fsPromises.writeFile(
    timestampPath,
    JSON.stringify(gpus, undefined, 2),
    'utf-8',
  );

  return gpus;
}
