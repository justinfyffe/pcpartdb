import {
  NotebookCheckCpuSource,
  PassMarkCpuSource,
  scrapeGeekBenchCpuSources,
  scrapeNotebookCheckCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import {
  AutomationAction,
  AutomationSource,
  concurrent,
  ConcurrentFn,
  formatProductName,
  ProductSourceKey,
  ProductType,
  UpsertAutomationSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 20;
const DELAY_BETWEEN_UPLOAD = 5_000;
const CONCURRENCY_CHUNK_SIZE = 5;

const TECHPOWERUP_URLS = [
  {
    company: 'Intel',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2025', // Intel, 2025
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2024~market_Mobile', // Intel, 2024, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2024~market_Desktop', // Intel, 2024, Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2024~market_Server%2fWorkstation', // Intel, 2024, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2023~market_Mobile', // Intel, 2023, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2023~market_Desktop', // Intel, 2023, Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2023~market_Server%2fWorkstation~memchannels_Dual+Channel', // Intel, 2023, Server, Dual Channel
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2023~market_Server%2fWorkstation~memchannels_Quad-Channel', // Intel, 2023, Server, Quad-Channel
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2023~market_Server%2fWorkstation~memchannels_Eight-Channel', // Intel, 2023, Server,
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2022', // Intel, 2022
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2021~market_Mobile', // Intel, 2021, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2021~market_Desktop', // Intel, 2021 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2021~market_Server%2fWorkstation', // Intel, 2021, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2021~market_Mobile+Workstation', // Intel, 2021, Mobile Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2020', // Intel, 2020
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2019', // Intel, 2019
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2018', // Intel, 2018
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2017', // Intel, 2017
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2016', // Intel, 2016
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2015~market_Mobile', // Intel, 2015, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2015~market_Desktop', // Intel, 2015 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2015~market_Server%2fWorkstation', // Intel, 2015, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2014~market_Mobile', // Intel, 2014, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2014~market_Desktop', // Intel, 2014 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2014~market_Server%2fWorkstation', // Intel, 2014, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2013~market_Mobile', // Intel, 2013, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2013~market_Desktop', // Intel, 2013 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2013~market_Server%2fWorkstation', // Intel, 2013, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2012~market_Mobile', // Intel, 2012, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2012~market_Desktop', // Intel, 2012 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2012~market_Server%2fWorkstation', // Intel, 2012, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2011~market_Mobile', // Intel, 2011, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2011~market_Desktop', // Intel, 2011 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2011~market_Server%2fWorkstation', // Intel, 2011, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2010~market_Mobile', // Intel, 2010, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2010~market_Desktop', // Intel, 2010 Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2010~market_Server%2fWorkstation', // Intel, 2010, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2009', // Intel, 2009
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2008', // Intel, 2008
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2007', // Intel, 2007
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2006', // Intel, 2006
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2005', // Intel, 2005
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2004', // Intel, 2004
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2003', // Intel, 2003
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2002', // Intel, 2002
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2001', // Intel, 2001
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_Intel~year_2000', // Intel, 2000
    ],
  },
  {
    company: 'AMD',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2025', // AMD 2025
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2024', // AMD 2024
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2023~market_Mobile', // AMD 2023, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2023~market_Desktop', // AMD 2023, Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2023~market_Server%2fWorkstation', // AMD 2023, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2022', // AMD 2022
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2021', // AMD 2021
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2020', // AMD 2020
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2019', // AMD 2019
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2018', // AMD 2018
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2017', // AMD 2017
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2016', // AMD 2016
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2015', // AMD 2015
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2014', // AMD 2014
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2013', // AMD 2013
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2012', // AMD 2012
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2011', // AMD 2011
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2010', // AMD 2010
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2009', // AMD 2009
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2008', // AMD 2008
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2007', // AMD 2007
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2006', // AMD 2006
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2005~market_Mobile', // AMD 2005, Mobile
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2005~market_Desktop', // AMD 2005, Desktop
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2005~market_Server%2fWorkstation', // AMD 2005, Server
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2004', // AMD 2004
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2003', // AMD 2003
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2002', // AMD 2002
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2001', // AMD 2001
      'https://www.techpowerup.com/cpu-specs/?f=mfgr_AMD~year_2000', // AMD 2000
    ],
  },
];

const PASSMARK_URLS = [
  'https://www.cpubenchmark.net/high_end_cpus.html', // high end
  'https://www.cpubenchmark.net/mid_range_cpus.html', // high mid range
  'https://www.cpubenchmark.net/midlow_range_cpus.html', // low mid range
  'https://www.cpubenchmark.net/low_end_cpus.html', // low end
];

export async function updateCpuSourcesAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  console.log('Executing updateCpuSourcesAction');

  // Scrape CPU Sources
  const [
    notebookCheckSources,
    techPowerUpSources,
    passMarkSources,
    geekBenchSources,
  ] = await concurrent(
    [
      () => getNotebookCheckSources(context),
      () => getTechPowerUpSources(context),
      () => getPassMarkSources(context),
      () => getGeekBenchSources(context),
    ],
    {
      limit: context.concurrency ? 3 : 1,
      delayBetweenChunksMs: context.requestChunkDelay,
    },
  );

  // Upload CPU Sources
  await uploadCpuSources(notebookCheckSources, context);
  await uploadCpuSources(techPowerUpSources, context);
  await uploadCpuSources(passMarkSources, context);
  await uploadCpuSources(geekBenchSources, context);

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateCpuSourcesDate: new Date().getTime(),
  };
}

async function getNotebookCheckSources(_context: AutomationContext) {
  console.log('Scraping CPU sources from NotebookCheck');

  const map: Record<string, NotebookCheckCpuSource> = {};

  await scrapeNotebookCheck(map);

  // Convert to source object
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Cpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.NotebookCheck,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} NotebookCheck sources`);

  return sources;
}

async function scrapeNotebookCheck(
  map: Record<string, NotebookCheckCpuSource>,
) {
  console.log('Scraping sources from NotebookCheck');
  try {
    const sources = await scrapeNotebookCheckCpuSources({});
    console.log(`Scraped ${sources.length} sources from NotebookCheck`);
    sources.forEach((cpu) => {
      map[cpu.name] = cpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getTechPowerUpSources(context: AutomationContext) {
  console.log('Scraping CPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpCpuSource> = {};

  // Construct requests
  const promises: ConcurrentFn[] = [];
  for (let i = 0; i < TECHPOWERUP_URLS.length; ++i) {
    const { company, urls } = TECHPOWERUP_URLS[i];

    for (const url of urls) {
      promises.push(() => scrapeTechPowerUp(url, company, map));
    }
  }

  // Execute concurrently
  await concurrent(promises, {
    limit: context.concurrency ? CONCURRENCY_CHUNK_SIZE : 1,
    delayBetweenChunksMs: context.requestChunkDelay,
  });

  // Convert to source object
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Cpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.TechPowerUp,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return sources;
}

async function scrapeTechPowerUp(
  url: string,
  company: string,
  map: Record<string, TechPowerUpCpuSource>,
) {
  console.log(`Scraping sources for url: ${url}`);
  try {
    const sources = await scrapeTechPowerUpCpuSources({ url, company });
    console.log(`Scraped ${sources.length} sources from ${url}`);
    sources.forEach((cpu) => {
      map[cpu.name] = cpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getPassMarkSources(context: AutomationContext) {
  console.log('Scraping CPU Sources from PassMark');

  const map: Record<string, PassMarkCpuSource> = {};

  // Construct requests
  const promises: ConcurrentFn[] = [];
  for (let i = 0; i < PASSMARK_URLS.length; ++i) {
    const url = PASSMARK_URLS[i];
    promises.push(() => scrapePassMark(url, map));
  }

  // Execute concurrently
  await concurrent(promises, {
    limit: context.concurrency ? CONCURRENCY_CHUNK_SIZE : 1,
    delayBetweenChunksMs: context.requestChunkDelay,
  });

  // Convert to source object
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Cpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.PassMark,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} PassMark sources`);

  return sources;
}

async function scrapePassMark(
  url: string,
  map: Record<string, PassMarkCpuSource>,
) {
  console.log(`Scraping sources for URL: ${url}`);

  try {
    const sources = await scrapePassMarkCpuSources({ url });
    console.log(`Scraped ${sources.length} sources from ${url}`);
    sources.forEach((cpu) => {
      map[cpu.name] = cpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getGeekBenchSources(_context: AutomationContext) {
  console.log('Scraping CPU Sources from GeekBench');

  const geekBenchSources = await scrapeGeekBenchCpuSources({});

  // Convert to source object
  const sources: AutomationSource[] = Object.values(geekBenchSources).map(
    (value) => ({
      groupKey: value.groupKey,
      externalKey: value.externalKey,
      productType: ProductType.Cpu,
      sourceName: formatProductName({
        company: value.company,
        name: value.name,
      }),
      sourceKey: ProductSourceKey.GeekBench,
      sourceUrl: value.url,
    }),
  );

  console.log(`Scraped ${sources.length} GeekBench sources`);

  return sources;
}

async function uploadCpuSources(
  sources: AutomationSource[],
  context: AutomationContext,
) {
  console.log('Upload CPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: AutomationSource[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    batches.push(batch);
  }

  // Upload sources via API
  let totalSources = 0;
  for (const batch of batches) {
    try {
      await context.api.post(
        'automation/sources',
        {
          sources: batch,
          autoArchive: true,
        } as UpsertAutomationSourcesRequest,
        { retries: 2 },
      );
      totalSources += batch.length;
      console.log(`Uploaded ${batch.length} sources`);
    } catch (e) {
      console.error(`Could not upload ${batch.length} sources.`);
    }

    await sleep(DELAY_BETWEEN_UPLOAD);
  }

  console.log(`Uploaded ${totalSources} sources`);
}
