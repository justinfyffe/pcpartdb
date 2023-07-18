import {
  GeekBenchCpuSource,
  PassMarkCpuSource,
  scrapeGeekBenchCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import { FetchCpuSourcesAction } from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutopilotContext } from '../types';

const TECHPOWERUP_QUERIES = [
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

const DELAY_BETWEEN_REQUEST = 10_000;

export async function handleFetchCpuSourcesAction(
  action: FetchCpuSourcesAction,
  context: AutopilotContext,
) {
  // Scrape CPU Sources
  const techPowerUpSources = await scrapeTechPowerUpSources();
  const passMarkSources = await scrapePassMarkSources();
  const geekBenchSources = await scrapeGeekBenchSources();

  // Check if CPU sources belong to any existing CPUs. Skip those that do.
  // Batch requests in groups of X urls.

  // Combine sources based on name

  // Create approval entries
}

async function scrapeTechPowerUpSources() {
  console.log('Scraping CPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpCpuSource> = {};
  for (let i = 0; i < TECHPOWERUP_QUERIES.length; ++i) {
    const query = TECHPOWERUP_QUERIES[i];
    console.log(`Scraping sources for query: ${query}`);
    try {
      const cpusForQuery = await scrapeTechPowerUpCpuSources({ query });
      console.log(`Scraped ${cpusForQuery.length} sources`);
      cpusForQuery.forEach((cpu) => {
        map[cpu.name] = cpu;
      });
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }
    await sleep(DELAY_BETWEEN_REQUEST);
  }

  const sources = Object.values(map);
  console.log(`Scraped ${sources.length} sources`);

  return sources;
}

async function scrapePassMarkSources() {
  console.log('Scraping CPU Sources from PassMark');

  const sources = await scrapePassMarkCpuSources({});
  await sleep(DELAY_BETWEEN_REQUEST);
  console.log(`Scraped ${sources.length} sources`);

  return sources as PassMarkCpuSource[];
}

async function scrapeGeekBenchSources() {
  console.log('Scraping CPU Sources from GeekBench');

  const sources = await scrapeGeekBenchCpuSources({});
  await sleep(DELAY_BETWEEN_REQUEST);
  console.log(`Scraped ${sources.length} sources`);

  return sources as GeekBenchCpuSource[];
}
