import {
  PassMarkCpuSource,
  scrapeGeekBenchCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import {
  AutoArchiveProductSourcesRequest,
  AutomationAction,
  concurrent,
  CpuDataSourceKey,
  CpuProductSource,
  ProductType,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 50;
const DEFAULT_CHUNK_DELAY = 30_000;
const DELAY_BETWEEN_UPLOAD = 3_000;
const CONCURRENCY_CHUNK_SIZE = 3;

const TECHPOWERUP_URLS = [
  {
    company: 'Intel',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2023&mobile=Yes&sort=name', // Intel, 2023, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2023&mobile=No&sort=name', // Intel, 2023, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2022&sort=name', // Intel, 2022
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2021&server=Yes&sort=name', // Intel, 2021, Server Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2021&server=No&sort=name', // Intel, 2021, Server No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2020&sort=name', // Intel, 2020
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2019&sort=name', // Intel, 2019
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2018&sort=name', // Intel, 2018
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2017&sort=name', // Intel, 2017
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2016&sort=name', // Intel, 2016
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2015&mobile=Yes&sort=name', // Intel, 2015, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2015&mobile=No&sort=name', // Intel, 2015, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2014&mobile=Yes&sort=name', // Intel, 2014, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2014&mobile=No&sort=name', // Intel, 2014, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2013&mobile=Yes&sort=name', // Intel, 2013, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2013&mobile=No&sort=name', // Intel, 2013, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2012&mobile=Yes&sort=name', // Intel, 2012, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2012&mobile=No&server=Yes&sort=name', // Intel, 2012, Mobile No, Server Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2012&mobile=No&server=No&sort=name', // Intel, 2012, Mobile No, Server No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2011&mobile=Yes&sort=name', // Intel, 2011, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2011&mobile=No&sort=name', // Intel, 2011, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2010&mobile=Yes&sort=name', // Intel, 2010, Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2010&mobile=No&sort=name', // Intel, 2010, Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2009&sort=name', // Intel, 2009
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2008&sort=name', // Intel, 2008
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2007&sort=name', // Intel, 2007
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2006&sort=name', // Intel, 2006
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2005&sort=name', // Intel, 2005
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2004&sort=name', // Intel, 2004
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2003&sort=name', // Intel, 2003
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2002&sort=name', // Intel, 2002
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2001&sort=name', // Intel, 2001
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=2000&sort=name', // Intel, 2000
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=1999&sort=name', // Intel, 1999
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&released=1998&sort=name', // Intel, 1998
    ],
  },
  {
    company: 'AMD',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2023&sort=name', // AMD 2023
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2022&sort=name', // AMD 2022
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2021&sort=name', // AMD 2021
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2020&sort=name', // AMD 2020
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2019&sort=name', // AMD 2019
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2018&sort=name', // AMD 2018
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2017&sort=name', // AMD 2017
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2016&sort=name', // AMD 2016
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2015&sort=name', // AMD 2015
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2014&sort=name', // AMD 2014
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2013&sort=name', // AMD 2013
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2012&sort=name', // AMD 2012
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2011&sort=name', // AMD 2011
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2010&sort=name', // AMD 2010
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2009&sort=name', // AMD 2009
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2008&sort=name', // AMD 2008
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2007&sort=name', // AMD 2007
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2006&sort=name', // AMD 2006
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2005&sort=name', // AMD 2005
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2004&sort=name', // AMD 2004
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2003&sort=name', // AMD 2003
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2002&sort=name', // AMD 2002
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2001&sort=name', // AMD 2001
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&released=2000&sort=name', // AMD 2000
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
  const [techPowerUpSources, passMarkSources, geekBenchSources] =
    await concurrent(
      [
        getTechPowerUpSources(context),
        getPassMarkSources(context),
        getGeekBenchSources(context),
      ],
      { limit: context.concurrency ? 3 : 1 },
    );

  // Upload CPU Sources
  await uploadCpuSources(techPowerUpSources, context);
  await uploadCpuSources(passMarkSources, context);
  await uploadCpuSources(geekBenchSources, context);

  // Trigger auto-archive
  await context.api.post(
    'products/sources/auto-archive',
    {
      productType: ProductType.Cpu,
    } as AutoArchiveProductSourcesRequest,
    { retries: 2 },
  );

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateCpuSourcesDate: new Date().getTime(),
  };
}

async function getTechPowerUpSources(context: AutomationContext) {
  console.log('Scraping CPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpCpuSource> = {};

  // Construct requests
  const promises: Promise<void>[] = [];
  for (let i = 0; i < TECHPOWERUP_URLS.length; ++i) {
    const { company, urls } = TECHPOWERUP_URLS[i];

    const randomizedUrls = urls
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (const url of randomizedUrls) {
      promises.push(scrapeTechPowerUp(url, company, map));
    }
  }

  // Execute concurrently
  await concurrent(promises, {
    limit: context.concurrency ? CONCURRENCY_CHUNK_SIZE : 1,
    delayBetweenChunksMs: context.requestChunkDelay || DEFAULT_CHUNK_DELAY,
  });

  // Convert to source object
  const sources: CpuProductSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Cpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: CpuDataSourceKey.TechPowerUp,
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
    console.log(`Scraped ${sources.length} sources`);
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
  const promises: Promise<void>[] = [];
  for (let i = 0; i < PASSMARK_URLS.length; ++i) {
    const url = PASSMARK_URLS[i];
    promises.push(scrapePassMark(url, map));
  }

  // Execute concurrently
  await concurrent(promises, {
    limit: context.concurrency ? CONCURRENCY_CHUNK_SIZE : 1,
    delayBetweenChunksMs: context.requestChunkDelay || DEFAULT_CHUNK_DELAY,
  });

  // Convert to source object
  const sources: CpuProductSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Cpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: CpuDataSourceKey.PassMark,
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
    console.log(`Scraped ${sources.length} sources`);
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
  const sources: CpuProductSource[] = Object.values(geekBenchSources).map(
    (value) => ({
      groupKey: value.groupKey,
      externalKey: value.externalKey,
      productType: ProductType.Cpu,
      sourceName: `${value.company || ''} ${value.name}`.trim(),
      sourceKey: CpuDataSourceKey.GeekBench,
      sourceUrl: value.url,
    }),
  );

  console.log(`Scraped ${sources.length} GeekBench sources`);

  return sources;
}

async function uploadCpuSources(
  sources: CpuProductSource[],
  context: AutomationContext,
) {
  console.log('Upload CPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: CpuProductSource[][] = [];
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
