import {
  scrapeTechPowerUpGpuSources as scrapeGpuSources,
  TechPowerUpGpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { sleep } from '../shared/process';
import { techPowerUpDataPath } from './utils';

const QUERIES = [
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
];

const SLEEP_DELAY = 15_000;

interface ScrapeTechPowerUpGpuSources {
  proxy?: boolean;
}

export async function scrapeTechPowerUpGpuSources(
  options: ScrapeTechPowerUpGpuSources,
) {
  console.log('Scraping GPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpGpuSource> = {};
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
