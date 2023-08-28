import {
  PassMarkGpuSource,
  scrapePassMarkGpuSources,
  scrapeTechPowerUpGpuSources,
  scrapeUlBenchmarkGpuSources,
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
} from '@pcpartdb/scraper';
import {
  AutoArchiveProductSourcesRequest,
  AutomationAction,
  concurrent,
  ConcurrentFn,
  GpuDataSourceKey,
  GpuProductSource,
  ProductType,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 8;
const DELAY_BETWEEN_UPLOAD = 5_000;
const CONCURRENCY_CHUNK_SIZE = 5;

const TECHPOWERUP_URLS = [
  {
    company: 'Intel',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2023&sort=name', // Intel, 2023
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2022&sort=name', // Intel, 2022
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2021&sort=name', // Intel, 2021
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2020&sort=name', // Intel, 2020
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2019&sort=name', // Intel, 2019
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2018&sort=name', // Intel, 2018
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2017&sort=name', // Intel, 2017
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2016&sort=name', // Intel, 2016
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2015&sort=name', // Intel, 2015
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2014&sort=name', // Intel, 2014
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2013&sort=name', // Intel, 2013
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2012&sort=name', // Intel, 2012
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2011&sort=name', // Intel, 2011
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2010&sort=name', // Intel, 2010
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2008&sort=name', // Intel, 2008
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2007&sort=name', // Intel, 2007
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2006&sort=name', // Intel, 2006
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2005&sort=name', // Intel, 2005
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2004&sort=name', // Intel, 2004
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2003&sort=name', // Intel, 2003
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2002&sort=name', // Intel, 2002
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2001&sort=name', // Intel, 2001
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=2000&sort=name', // Intel, 2000
    ],
  },
  {
    company: 'AMD',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2023&sort=name', // AMD, 2023
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2022&sort=name', // AMD, 2022
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2021&sort=name', // AMD, 2021
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2020&sort=name', // AMD, 2020
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2019&sort=name', // AMD, 2019
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2018&sort=name', // AMD, 2018
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2017&sort=name', // AMD, 2017
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2016&sort=name', // AMD, 2016
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2015&sort=name', // AMD, 2015
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2014&sort=name', // AMD, 2014
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2013&mobile=Yes&sort=name', // AMD, 2013, Mobile Yes
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2013&mobile=No&sort=name', // AMD, 2013, Mobile No
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2012&sort=name', // AMD, 2012
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2011&sort=name', // AMD, 2011
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2010&sort=name', // AMD, 2010
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2009&sort=name', // AMD, 2009
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2008&sort=name', // AMD, 2008
      'https://www.techpowerup.com/gpu-specs/?mfgr=AMD&released=2007&sort=name', // AMD, 2007
    ],
  },
  {
    company: 'NVIDIA',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2023&sort=name', // NVIDIA, 2023
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2022&sort=name', // NVIDIA, 2022
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2021&sort=name', // NVIDIA, 2021
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2020&sort=name', // NVIDIA, 2020
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2019&sort=name', // NVIDIA, 2019
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2018&sort=name', // NVIDIA, 2018
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2017&sort=name', // NVIDIA, 2017
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2016&sort=name', // NVIDIA, 2016
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2015&sort=name', // NVIDIA, 2015
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2014&sort=name', // NVIDIA, 2014
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2013&sort=name', // NVIDIA, 2013
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2012&sort=name', // NVIDIA, 2012
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2011&sort=name', // NVIDIA, 2011
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2010&sort=name', // NVIDIA, 2010
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2009&sort=name', // NVIDIA, 2009
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2008&mobile=Yes&sort=name', // NVIDIA, 2008 Mobile Yes
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2008&mobile=No&sort=name', // NVIDIA, 2008 Mobile No
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2007&sort=name', // NVIDIA, 2007
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2006&sort=name', // NVIDIA, 2006
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2005&sort=name', // NVIDIA, 2005
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2004&sort=name', // NVIDIA, 2004
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2003&sort=name', // NVIDIA, 2003
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2002&sort=name', // NVIDIA, 2002
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2001&sort=name', // NVIDIA, 2001
      'https://www.techpowerup.com/gpu-specs/?mfgr=NVIDIA&released=2000&sort=name', // NVIDIA, 2000
    ],
  },
  {
    company: 'ATI',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2012&sort=name', // ATI, 2012
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2011&sort=name', // ATI, 2011
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2010&sort=name', // ATI, 2010
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2009&sort=name', // ATI, 2009
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2008&sort=name', // ATI, 2008
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2007&sort=name', // ATI, 2007
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2006&sort=name', // ATI, 2006
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2005&sort=name', // ATI, 2005
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2004&sort=name', // ATI, 2004
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2003&sort=name', // ATI, 2003
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2002&sort=name', // ATI, 2002
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2001&sort=name', // ATI, 2001
      'https://www.techpowerup.com/gpu-specs/?mfgr=ATI&released=2000&sort=name', // ATI, 2000
    ],
  },
];

const PASSMARK_URLS = [
  'https://www.videocardbenchmark.net/high_end_gpus.html', // High End
  'https://www.videocardbenchmark.net/mid_range_gpus.html', // High Mid End
  'https://www.videocardbenchmark.net/midlow_range_gpus.html', // Low Mid End
  'https://www.videocardbenchmark.net/low_end_gpus.html', // Low End
];

const UL_BENCHMARK_QUERIES = [
  'intel',
  'nvidia',
  'amd',
  'ati',
  'arc',
  'rtx',
  'geforce',
  'graphics',
  'radeon',
  'vega',
  'titan',
];

export async function updateGpuChipsetSourcesAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  console.log('Executing updateGpuChipsetSourcesAction');

  // Scrape GPU Sources (concurrently if desired)
  const [techPowerUp, passMark, ulBenchmarks] = await concurrent(
    [
      () => getTechPowerUpSources(context),
      () => getPassMarkSources(context),
      () => getUlBenchmarkSources(context),
    ],
    {
      limit: context.concurrency ? 3 : 1,
      delayBetweenChunksMs: context.requestChunkDelay,
    },
  );
  const { sources: techPowerUpSources } = techPowerUp;
  const { sources: passMarkSources } = passMark;
  const { sources: ulBenchmarkSources } = ulBenchmarks;

  // Upload CPU Sources
  await uploadGpuSources(techPowerUpSources, context);
  await uploadGpuSources(passMarkSources, context);
  await uploadGpuSources(ulBenchmarkSources, context);

  // Trigger auto-archive
  await context.api.post(
    'products/sources/auto-archive',
    { productType: ProductType.Gpu } as AutoArchiveProductSourcesRequest,
    { retries: 2 },
  );

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateGpuChipsetSourcesDate: new Date().getTime(),
  };
}

async function getTechPowerUpSources(context: AutomationContext) {
  console.log('Scraping GPU chipset sources from TechPowerUp');

  const map: Record<string, TechPowerUpGpuSource> = {};

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
  const sources: GpuProductSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.TechPowerUp,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return { sources };
}

async function scrapeTechPowerUp(
  url: string,
  company: string,
  map: Record<string, TechPowerUpGpuSource>,
) {
  console.log(`Scraping sources for url: ${url}`);
  try {
    const sources = await scrapeTechPowerUpGpuSources({ url, company });
    console.log(`Scraped ${sources.length} sources`);
    sources.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getPassMarkSources(context: AutomationContext) {
  console.log('Scraping CPU Sources from PassMark');

  const map: Record<string, PassMarkGpuSource> = {};

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
  const sources: GpuProductSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.VideocardBenchmarks,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} PassMark sources`);

  return { sources };
}

async function scrapePassMark(
  url: string,
  map: Record<string, PassMarkGpuSource>,
) {
  console.log(`Scraping sources for URL: ${url}`);

  try {
    const sources = await scrapePassMarkGpuSources({ url });
    console.log(`Scraped ${sources.length} sources`);
    sources.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getUlBenchmarkSources(context: AutomationContext) {
  console.log('Scraping CPU Sources from UL');

  const map: Record<string, UlBenchmarkGpuSource> = {};

  // Construct requests
  const promises: ConcurrentFn[] = [];
  for (let i = 0; i < UL_BENCHMARK_QUERIES.length; ++i) {
    const query = UL_BENCHMARK_QUERIES[i];
    promises.push(() => scrapeUlBenchmark(query, map));
  }

  // Execute concurrently
  await concurrent(promises, {
    limit: context.concurrency ? CONCURRENCY_CHUNK_SIZE : 1,
    delayBetweenChunksMs: context.requestChunkDelay,
  });

  // Convert to source object
  const sources: GpuProductSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.UlBenchmarks,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} UL Benchmark sources`);

  return { sources };
}

async function scrapeUlBenchmark(
  query: string,
  map: Record<string, UlBenchmarkGpuSource>,
) {
  console.log(`Scraping sources for query: ${query}`);

  try {
    const sources = await scrapeUlBenchmarkGpuSources({ query });
    console.log(`Scraped ${sources.length} sources`);
    sources.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function uploadGpuSources(
  sources: GpuProductSource[],
  context: AutomationContext,
) {
  console.log('Upload GPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: GpuProductSource[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    batches.push(batch);
  }

  // Upload sources via API
  let totalSources = 0;
  for (const batch of batches) {
    try {
      await context.api.post(
        'products/sources',
        {
          sources: batch,
        } as UpsertProductSourcesRequest,
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
