import {
  scrapeGeekBenchCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import {
  CpuDataSourceKey,
  CreateProductSourcesRequest,
  CreateProductSourcesResponse,
  FetchCpuSourcesAction,
  ProductSource,
  ProductType,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

// TODO: Simplify. Store one source per row in database. Use UI and backend to combine them.
// Don't delete/reject sources, just archive them.

const BATCH_SIZE = 100;
const DELAY_BETWEEN_SOURCE_REQUEST = 10_000;
const DELAY_BETWEEN_UPLOAD = 10_000;

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

export async function fetchCpuSourcesAction(
  action: FetchCpuSourcesAction,
  context: AutomationContext,
) {
  // Scrape CPU Sources
  const techPowerUpSources = await getTechPowerUpSources();
  const passMarkSources = await getPassMarkSources();
  const geekBenchSources = await getGeekBenchSources();

  // Upload CPU Sources
  await uploadCpuSources(techPowerUpSources, context);
  await uploadCpuSources(passMarkSources, context);
  await uploadCpuSources(geekBenchSources, context);
}

async function getTechPowerUpSources() {
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
    await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Cpu,
    productName: value.name,
    productCompany: value.company,
    sourceKey: CpuDataSourceKey.TechPowerUp,
    sourceUrl: value.url,
    archived: false,
  }));

  console.log(`Scraped ${sources.length} sources`);

  return sources;
}

async function getPassMarkSources() {
  console.log('Scraping CPU Sources from PassMark');

  const passMarkSources = await scrapePassMarkCpuSources({});
  await sleep(DELAY_BETWEEN_SOURCE_REQUEST);

  const sources: ProductSource[] = Object.values(passMarkSources).map(
    (value) => ({
      productType: ProductType.Cpu,
      productName: value.name,
      productCompany: value.company,
      sourceKey: CpuDataSourceKey.PassMark,
      sourceUrl: value.url,
      archived: false,
    }),
  );

  console.log(`Scraped ${sources.length} sources`);

  return sources;
}

async function getGeekBenchSources() {
  console.log('Scraping CPU Sources from GeekBench');

  const geekBenchSources = await scrapeGeekBenchCpuSources({});
  await sleep(DELAY_BETWEEN_SOURCE_REQUEST);

  const sources: ProductSource[] = Object.values(geekBenchSources).map(
    (value) => ({
      productType: ProductType.Cpu,
      productName: value.name,
      productCompany: value.company,
      sourceKey: CpuDataSourceKey.PassMark,
      sourceUrl: value.url,
      archived: false,
    }),
  );

  console.log(`Scraped ${sources.length} sources`);

  return sources;
}

async function uploadCpuSources(
  sources: ProductSource[],
  context: AutomationContext,
) {
  console.log('Filter sources to new sources only.');

  // Create batches so we can upload multiple ones at a time.
  const batches: ProductSource[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    batches.push(batch);
  }

  // Check each batch of URLs from API
  let totalNewSources = 0;
  for (const batch of batches) {
    try {
      const response = await context.api.post<CreateProductSourcesResponse>(
        'product/sources/bulk',
        {
          sources: batch,
        } as CreateProductSourcesRequest,
      );
      totalNewSources += response.totalNewSources;
    } catch (e) {
      //
    }

    await sleep(DELAY_BETWEEN_UPLOAD);
  }

  console.log(`Uploaded ${totalNewSources} new sources`);
}
