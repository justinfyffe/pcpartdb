import {
  scrapeTechPowerUpCpuSources as scrapeCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import * as fsPromises from 'fs/promises';
import { yyyyMmDd } from '../../shared/date';
import { sleep } from '../../shared/process';
import { techPowerUpPath } from './utils';

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
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
];

const SLEEP_DELAY = 10_000;

interface ScrapeTechPowerUpCpuSourcesOptions {
  noProxy?: boolean;
}

export async function scrapeTechPowerUpCpuSources(
  options: ScrapeTechPowerUpCpuSourcesOptions,
) {
  console.log('Scraping CPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpCpuSource> = {};
  for (let i = 0; i < QUERIES.length; ++i) {
    const query = QUERIES[i];
    console.log(`Scraping query: ${query}`);
    try {
      const cpusForQuery = await scrapeCpuSources({ ...options, url: '' });
      console.log(`Scraped ${cpusForQuery.length}`);
      cpusForQuery.forEach((cpu) => {
        map[cpu.name] = cpu;
      });
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }
    await sleep(SLEEP_DELAY);
  }

  const cpus = Object.values(map);
  console.log(`Scraped ${cpus.length} sources`);

  const path = techPowerUpPath('sources.json');
  const timestampPath = techPowerUpPath(`sources-${yyyyMmDd()}.json`);

  await fsPromises.writeFile(path, JSON.stringify(cpus, undefined, 2), 'utf-8');
  await fsPromises.writeFile(
    timestampPath,
    JSON.stringify(cpus, undefined, 2),
    'utf-8',
  );

  console.log(`Finished scraping sources. Saved to ${path}`);

  return cpus;
}
