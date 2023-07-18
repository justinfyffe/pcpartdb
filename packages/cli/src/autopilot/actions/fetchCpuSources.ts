import {
  GeekBenchCpuSource,
  PassMarkCpuSource,
  scrapeGeekBenchCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import {
  AutopilotApproval,
  AutopilotApprovalStatus,
  AutopilotApprovalType,
  CheckCpuSourcesRequest,
  CheckCpuSourcesResponse,
  CpuSourceApproval,
  FetchCpuSourcesAction,
} from '@pcpartdb/shared';
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

const DELAY_BETWEEN_SOURCE_REQUEST = 10_000;
const DELAY_BETWEEN_SOURCE_CHECK = 10_000;

export async function handleFetchCpuSourcesAction(
  action: FetchCpuSourcesAction,
  context: AutopilotContext,
) {
  // Scrape CPU Sources
  const techPowerUpSources = await getTechPowerUpSources(context);
  const passMarkSources = await getPassMarkSources(context);
  const geekBenchSources = await getGeekBenchSources(context);

  // Create approval entries
  const approvals = createApprovalObjects(
    techPowerUpSources,
    passMarkSources,
    geekBenchSources,
  );

  // Save approval entries
  await saveApprovals(approvals, context);
}

async function getTechPowerUpSources(context: AutopilotContext) {
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

  const sources = Object.values(map);
  console.log(`Scraped ${sources.length} sources`);

  return filterNewSources(sources, context);
}

async function getPassMarkSources(context: AutopilotContext) {
  console.log('Scraping CPU Sources from PassMark');

  const sources = await scrapePassMarkCpuSources({});
  await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  console.log(`Scraped ${sources.length} sources`);

  return filterNewSources(sources, context);
}

async function getGeekBenchSources(context: AutopilotContext) {
  console.log('Scraping CPU Sources from GeekBench');

  const sources = await scrapeGeekBenchCpuSources({});
  await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  console.log(`Scraped ${sources.length} sources`);

  return filterNewSources(sources, context);
}

async function filterNewSources(
  sources: (TechPowerUpCpuSource | PassMarkCpuSource | GeekBenchCpuSource)[],
  context: AutopilotContext,
) {
  console.log('Filter sources to new sources only.');

  // Create map of sources to track.
  const map: Record<
    string,
    TechPowerUpCpuSource | PassMarkCpuSource | GeekBenchCpuSource
  > = {};
  for (const source of sources) {
    map[source.url] = source;
  }

  // Create list of URL batches to check if they already exist.
  // Batches are used to reduce request size to API.
  const BATCH_SIZE = 100;
  const batches: string[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE).map((source) => source.url);
    batches.push(batch);
  }

  // Check each batch of URLs from API
  for (const batch of batches) {
    const { existingSources } = await context.api.post<CheckCpuSourcesResponse>(
      'autopilot/check-cpu-sources',
      { sources: batch } as CheckCpuSourcesRequest,
    );

    // Remove sources that already exist.
    for (const existingSource of existingSources) {
      delete map[existingSource];
    }

    await sleep(DELAY_BETWEEN_SOURCE_CHECK);
  }

  const newSources = Object.values(map);
  console.log(`Filtered to ${newSources.length} new sources`);

  return newSources;
}

function createApprovalObjects(
  techPowerUpSources: TechPowerUpCpuSource[],
  passMarkSources: PassMarkCpuSource[],
  geekBenchSources: GeekBenchCpuSource[],
) {
  const map: Record<string, CpuSourceApproval> = {};
  techPowerUpSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      cpuName: orig.cpuName || data.name,
      techPowerUpName: data.name,
      techPowerUpUrl: orig.techPowerUpUrl || data.url,
    };
  });
  passMarkSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      cpuName: orig.cpuName || data.name,
      passMarkName: data.name,
      passMarkUrl: orig.passMarkUrl || data.url,
    };
  });
  geekBenchSources.forEach((data) => {
    const key = data.name;
    const orig = map[key] || {};
    map[key] = {
      ...orig,
      cpuName: orig.cpuName || data.name,
      geekBenchName: data.name,
      geekBenchUrl: orig.geekBenchUrl || data.url,
    };
  });

  return Object.values(map);
}

async function saveApprovals(
  approvals: CpuSourceApproval[],
  context: AutopilotContext,
) {
  // Create list of URL batches to check if they already exist.
  // Batches are used to reduce request size to API.
  const BATCH_SIZE = 100;
  const batches: AutopilotApproval<CpuSourceApproval>[][] = [];
  for (let i = 0; i < approvals.length; i += BATCH_SIZE) {
    const batch = approvals.slice(i, i + BATCH_SIZE).map(
      (approval) =>
        ({
          description: '',
          status: AutopilotApprovalStatus.Pending,
          type: AutopilotApprovalType.CpuSource,
          data: approval,
        } as AutopilotApproval<CpuSourceApproval>),
    );
    batches.push(batch);
  }

  // Check each batch of URLs from API
  for (const batch of batches) {
    await context.api.post('autopilot/approvals', {
      approvals: batch,
    });

    await sleep(DELAY_BETWEEN_SOURCE_CHECK);
  }
}
