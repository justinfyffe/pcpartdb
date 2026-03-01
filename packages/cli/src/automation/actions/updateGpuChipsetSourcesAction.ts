import {
  NotebookCheckGpuSource,
  PassMarkGpuSource,
  scrapeNotebookCheckGpuSources,
  scrapePassMarkGpuSources,
  scrapeTechPowerUpGpuSources,
  TechPowerUpGpuSource,
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
const MAX_ATTEMPTS_PER_PAGE = 5;

const TECHPOWERUP_URLS = [
  {
    company: 'Intel',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2026', // Intel, 2026
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2025', // Intel, 2025
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2024', // Intel, 2024
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2023', // Intel, 2023
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2022', // Intel, 2022
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2021', // Intel, 2021
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2020', // Intel, 2020
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2019', // Intel, 2019
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2018', // Intel, 2018
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2017', // Intel, 2017
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2016', // Intel, 2016
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2015', // Intel, 2015
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2014', // Intel, 2014
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2013', // Intel, 2013
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2012', // Intel, 2012
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2011', // Intel, 2011
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2010', // Intel, 2010
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2008', // Intel, 2008
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2007', // Intel, 2007
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2006', // Intel, 2006
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2005', // Intel, 2005
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2004', // Intel, 2004
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2003', // Intel, 2003
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2002', // Intel, 2002
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2001', // Intel, 2001
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_Intel~year_2000', // Intel, 2000
    ],
  },
  {
    company: 'AMD',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2026', // AMD, 2026
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2025', // AMD, 2025
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2024', // AMD, 2024
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2023', // AMD, 2023
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2022', // AMD, 2022
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2021', // AMD, 2021
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2020', // AMD, 2020
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2019', // AMD, 2019
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2018', // AMD, 2018
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2017', // AMD, 2017
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2016', // AMD, 2016
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2015', // AMD, 2015
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2014', // AMD, 2014
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2013&mobile=Yes', // AMD, 2013, Mobile Yes
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2013&mobile=No', // AMD, 2013, Mobile No
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2012', // AMD, 2012
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2011', // AMD, 2011
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2010', // AMD, 2010
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2009', // AMD, 2009
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2008', // AMD, 2008
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_AMD~year_2007', // AMD, 2007
    ],
  },
  {
    company: 'NVIDIA',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2026', // NVIDIA, 2026
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2025', // NVIDIA, 2025
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2024', // NVIDIA, 2024
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2023', // NVIDIA, 2023
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2022', // NVIDIA, 2022
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2021', // NVIDIA, 2021
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2020', // NVIDIA, 2020
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2019', // NVIDIA, 2019
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2018', // NVIDIA, 2018
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2017', // NVIDIA, 2017
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2016', // NVIDIA, 2016
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2015', // NVIDIA, 2015
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2014', // NVIDIA, 2014
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2013', // NVIDIA, 2013
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2012', // NVIDIA, 2012
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2011', // NVIDIA, 2011
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2010', // NVIDIA, 2010
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2009', // NVIDIA, 2009
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2008&mobile=Yes', // NVIDIA, 2008 Mobile Yes
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2008&mobile=No', // NVIDIA, 2008 Mobile No
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2007', // NVIDIA, 2007
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2006', // NVIDIA, 2006
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2005', // NVIDIA, 2005
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2004', // NVIDIA, 2004
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2003', // NVIDIA, 2003
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2002', // NVIDIA, 2002
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2001', // NVIDIA, 2001
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_NVIDIA~year_2000', // NVIDIA, 2000
    ],
  },
  {
    company: 'ATI',
    urls: [
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2012', // ATI, 2012
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2011', // ATI, 2011
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2010', // ATI, 2010
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2009', // ATI, 2009
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2008', // ATI, 2008
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2007', // ATI, 2007
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2006', // ATI, 2006
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2005', // ATI, 2005
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2004', // ATI, 2004
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2003', // ATI, 2003
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2002', // ATI, 2002
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2001', // ATI, 2001
      'https://www.techpowerup.com/gpu-specs/?f=mfgr_ATI~year_2000', // ATI, 2000
    ],
  },
];

const PASSMARK_URLS = [
  'https://www.videocardbenchmark.net/high_end_gpus.html', // High End
  'https://www.videocardbenchmark.net/mid_range_gpus.html', // High Mid End
  'https://www.videocardbenchmark.net/midlow_range_gpus.html', // Low Mid End
  'https://www.videocardbenchmark.net/low_end_gpus.html', // Low End
];

export async function updateGpuChipsetSourcesAction(
  _action: AutomationAction,
  context: AutomationContext,
) {
  console.log('Executing updateGpuChipsetSourcesAction');

  // Scrape GPU Sources (concurrently if desired)
  const [notebookCheck, techPowerUp, passMark] = await concurrent(
    [
      () => getNotebookCheckSources(context),
      () => getTechPowerUpSources(context),
      () => getPassMarkSources(context),
    ],
    {
      limit: context.concurrency ? 3 : 1,
      delayBetweenChunksMs: context.requestChunkDelay,
    },
  );
  const { sources: notebookCheckSources } = notebookCheck;
  const { sources: techPowerUpSources } = techPowerUp;
  const { sources: passMarkSources } = passMark;

  // Upload GPU Sources

  await uploadGpuSources(notebookCheckSources, context);
  await uploadGpuSources(passMarkSources, context);
  await uploadGpuSources(techPowerUpSources, context);

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateGpuChipsetSourcesDate: new Date().getTime(),
  };
}

async function getNotebookCheckSources(_context: AutomationContext) {
  console.log('Scraping GPU sources from NotebookCheck');

  const map: Record<string, NotebookCheckGpuSource> = {};

  await scrapeNotebookCheck(map);

  // Convert to source object
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.NotebookCheck,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} NotebookCheck sources`);

  return { sources };
}

async function scrapeNotebookCheck(
  map: Record<string, NotebookCheckGpuSource>,
) {
  console.log('Scraping sources from NotebookCheck');
  try {
    let sources = [];
    let attempt = 0;
    do {
      sources = await scrapeNotebookCheckGpuSources({});
    } while (sources.length == 0 && attempt++ < MAX_ATTEMPTS_PER_PAGE);

    console.log(`Scraped ${sources.length} sources from NotebookCheck`);
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
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.PassMark,
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
    let sources = [];
    let attempt = 0;
    do {
      sources = await scrapePassMarkGpuSources({ url });
    } while (sources.length == 0 && attempt++ < MAX_ATTEMPTS_PER_PAGE);

    console.log(`Scraped ${sources.length} sources from ${url}`);
    sources.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function getTechPowerUpSources(context: AutomationContext) {
  console.log('Scraping GPU sources from TechPowerUp');

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
  const sources: AutomationSource[] = Object.values(map).map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.TechPowerUp,
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
    let sources = [];
    let attempt = 0;
    do {
      sources = await scrapeTechPowerUpGpuSources({ url, company });
    } while (sources.length == 0 && attempt++ < MAX_ATTEMPTS_PER_PAGE);

    console.log(`Scraped ${sources.length} sources from ${url}`);
    sources.forEach((gpu) => {
      map[gpu.name] = gpu;
    });
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
  }
}

async function uploadGpuSources(
  sources: AutomationSource[],
  context: AutomationContext,
) {
  console.log('Upload GPU sources to API.');

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
        { sources: batch, autoArchive: true } as UpsertAutomationSourcesRequest,
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
