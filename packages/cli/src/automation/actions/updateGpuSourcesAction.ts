import {
  PassMarkGpuSource,
  scrapePassMarkGpuSources,
  scrapeTechPowerUpGpuSources,
  scrapeUlBenchmarkGpuSources,
  TechPowerUpGpuSource,
  UlBenchmarkGpuSource,
} from '@pcpartdb/scraper';
import {
  AutomationAction,
  GpuDataSourceKey,
  ProductSource,
  ProductType,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 50;
const DELAY_BETWEEN_SOURCE_REQUEST = 10_000;
const DELAY_BETWEEN_TECHPOWERUP_REQUEST = 30_000;
const DELAY_BETWEEN_UPLOAD = 3_000;

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
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=1999&sort=name', // Intel, 1999
      'https://www.techpowerup.com/gpu-specs/?mfgr=Intel&released=1998&sort=name', // Intel, 1998
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
];

const PASSMARK_URLS = [
  'https://www.videocardbenchmark.net/high_end_gpus.html', // High End
  'https://www.videocardbenchmark.net/mid_range_gpus.html', // High Mid End
  'https://www.videocardbenchmark.net/midlow_range_gpus.html', // Low Mid End
  'https://www.videocardbenchmark.net/low_end_gpus.html', // Low End
];

const UL_BENCHMARK_QUERIES = [
  'https://benchmarks.ul.com/compare/best-gpus?search=intel',
  'https://benchmarks.ul.com/compare/best-gpus?search=nvidia',
  'https://benchmarks.ul.com/compare/best-gpus?search=amd',
  'https://benchmarks.ul.com/compare/best-gpus?search=arc',
  'https://benchmarks.ul.com/compare/best-gpus?search=rtx',
  'https://benchmarks.ul.com/compare/best-gpus?search=geforce',
  'https://benchmarks.ul.com/compare/best-gpus?search=graphics',
  'https://benchmarks.ul.com/compare/best-gpus?search=radeon',
  'https://benchmarks.ul.com/compare/best-gpus?search=vega',
  'https://benchmarks.ul.com/compare/best-gpus?search=titan',
];

export async function updateGpuSourcesAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  console.log('Executing updateGpuSourcesAction');

  // Scrape GPU Sources
  const techPowerUpSources = await getTechPowerUpSources();
  const passMarkSources = await getPassMarkSources();
  const ulBenchmarkSources = await getUlBenchmarkSources();

  // Upload CPU Sources
  await uploadGpuSources(techPowerUpSources, context);
  await uploadGpuSources(passMarkSources, context);
  await uploadGpuSources(ulBenchmarkSources, context);

  // Trigger auto-archive
  await context.api.post('products/sources/auto-archive', null);

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateGpuSourcesDate: new Date().getTime(),
  };
}

async function getTechPowerUpSources() {
  console.log('Scraping GPU chipset sources from TechPowerUp');

  const map: Record<string, TechPowerUpGpuSource> = {};
  for (let i = 0; i < TECHPOWERUP_URLS.length; ++i) {
    const { company, urls } = TECHPOWERUP_URLS[i];

    const randomizedUrls = urls
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (const url of randomizedUrls) {
      console.log(`Scraping sources for url: ${url}`);
      try {
        const sources = await scrapeTechPowerUpGpuSources({ url, company });
        console.log(`Scraped ${sources.length} sources`);
        sources.forEach((cpu) => {
          map[cpu.name] = cpu;
        });
      } catch (err) {
        console.error('Encountered error when scraping.');
        console.error(err);
      }
      await sleep(DELAY_BETWEEN_TECHPOWERUP_REQUEST);
    }
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Gpu,
    sourceName: `${value.company} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.TechPowerUp,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return sources;
}

async function getPassMarkSources() {
  console.log('Scraping CPU Sources from PassMark');

  const map: Record<string, PassMarkGpuSource> = {};
  for (let i = 0; i < PASSMARK_URLS.length; ++i) {
    const url = PASSMARK_URLS[i];
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

    await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Gpu,
    sourceName: `${value.company} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.VideocardBenchmarks,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} PassMark sources`);

  return sources;
}

async function getUlBenchmarkSources() {
  console.log('Scraping CPU Sources from UL');

  const map: Record<string, UlBenchmarkGpuSource> = {};
  for (let i = 0; i < UL_BENCHMARK_QUERIES.length; ++i) {
    const query = UL_BENCHMARK_QUERIES[i];
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

    await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Gpu,
    sourceName: `${value.company} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.UlBenchmarks,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} PassMark sources`);

  return sources;
}

async function uploadGpuSources(
  sources: ProductSource[],
  context: AutomationContext,
) {
  console.log('Upload GPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: ProductSource[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    batches.push(batch);
  }

  // Upload sources via API
  let totalSources = 0;
  for (const batch of batches) {
    try {
      await context.api.post('products/sources', {
        sources: batch,
      } as UpsertProductSourcesRequest);
      totalSources += batch.length;
      console.log(`Uploaded ${batch.length} sources`);
    } catch (e) {
      console.error(`Could not upload ${batch.length} sources.`);
    }

    await sleep(DELAY_BETWEEN_UPLOAD);
  }

  console.log(`Uploaded ${totalSources} sources`);
}
