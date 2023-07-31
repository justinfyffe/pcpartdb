import {
  PassMarkCpuSource,
  scrapeGeekBenchCpuSources,
  scrapePassMarkCpuSources,
  scrapeTechPowerUpCpuSources,
  TechPowerUpCpuSource,
} from '@pcpartdb/scraper';
import {
  AutomationAction,
  CpuDataSourceKey,
  ProductSource,
  ProductType,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 10;
const DELAY_BETWEEN_SOURCE_REQUEST = 10_000;
const DELAY_BETWEEN_TECHPOWERUP_REQUEST = 30_000;
const DELAY_BETWEEN_UPLOAD = 3_000;

const TECHPOWERUP_URLS = [
  {
    company: 'Intel',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Atom&sort=name', // Intel Atom
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Atom%20x5&sort=name', // Intel Atom x5
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Atom%20x7&sort=name', // Intel Atom x7
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&mobile=No&generation=Intel%20Celeron&sort=name', // Intel Celeron - Mobile No
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&mobile=Yes&generation=Intel%20Celeron&sort=name', // Intel Celeron - Mobile Yes
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium&sort=name', // Intel Pentium
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20III&sort=name', // Intel Pentium III
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%204&sort=name', // Intel Pentium 4
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%204%20HT&sort=name', // Intel Pentium 4 HT
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%204-M&sort=name', // Intel Pentium 4-M
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Mobile%20Pentium%204&sort=name', // Intel Mobile Pentium 4
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Mobile%20Pentium%204%20HT&sort=name', // Intel Mobile Pentium 4 HT
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Celeron%20D&sort=name', // Intel Celeron D
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20M&sort=name', // Intel Pentium M
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20D&sort=name', // Intel Pentium D
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20Extreme%20Edition&sort=name', // Intel Pentium Extreme Edition
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20Dual-Core&sort=name', // Intel Pentium Dual-Core
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20Solo&sort=name', // Intel Core Solo
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20Duo&sort=name', // Intel Core Duo
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%202%20Duo&sort=name', // Intel Core 2 Duo
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%202%20Extreme&sort=name', // Intel Core 2 Extreme
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%202%20Solo&sort=name', // Intel Core 2 Solo
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%202%20Quad&sort=name', // Intel Core 2 Quad
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i3&process=10%20nm&sort=name', // Intel Core i3 - 10nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i3&process=14%20nm&sort=name', // Intel Core i3 - 14nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i3&process=22%20nm&sort=name', // Intel Core i3 - 22nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i3&process=32%20nm&sort=name', // Intel Core i3 - 32nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i5&process=10%20nm&sort=name', // Intel Core i5 - 10nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i5&process=14%20nm&sort=name', // Intel Core i5 - 14nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i5&process=22%20nm&sort=name', // Intel Core i5 - 22nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i5&process=32%20nm&sort=name', // Intel Core i5 - 32nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i5&process=45%20nm&sort=name', // Intel Core i5 - 45nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7&process=10%20nm&sort=name', // Intel Core i7 - 10nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7&process=14%20nm&sort=name', // Intel Core i7 - 14nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7&process=22%20nm&sort=name', // Intel Core i7 - 22nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7&process=32%20nm&sort=name', // Intel Core i7 - 32nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7&process=45%20nm&sort=name', // Intel Core i7 - 45nm
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7%20Extreme&sort=name', // Intel Core i7 Extreme
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20M&sort=name', // Intel Core M
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20m3&sort=name', // Intel Core m3
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20Gold&sort=name', // Intel Pentium Gold
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i9&sort=name', // Intel Core i9
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i9%20Extreme&sort=name', // Intel Core i9 Extreme
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20Silver&sort=name', // Intel Pentium Silver
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Core%20i7%2040th&sort=name', // Intel Core i7 40th
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=1&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 1
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=2&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 2
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=4&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 4
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=6&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 6
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=8&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 8
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&nCores=10&generation=Intel%20Xeon&sort=name', // Intel Xeon - Cores 10
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Intel%20Processor&sort=name', // Intel Intel Processor
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20MP&sort=name', // Intel Xeon MP
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20II%20Xeon&sort=name', // Intel Pentium II Xeon
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Pentium%20III%20Xeon&sort=name', // Intel Pentium III Xeon
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E7&sort=name', // Intel Xeon E7
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E3&sort=name', // Intel Xeon E3
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E5&socket=Intel%20Socket%201356&sort=name', // Intel Xeon E5 - Socket 1356
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E5&socket=Intel%20Socket%202011&sort=name', // Intel Xeon E5 - Socket 2011
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E5&socket=Intel%20Socket%202011-3&sort=name', // Intel Xeon E5 - Socket 2011-3
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20D&sort=name', // Intel Xeon D
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20W&sort=name', // Intel Xeon W
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Bronze&sort=name', // Intel Xeon Bronze
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Silver&sort=name', // Intel Xeon Silver
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Gold&sort=name', // Intel Xeon Gold
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Platinum&sort=name', // Intel Xeon Platinum
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20E&sort=name', // Intel Xeon E
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Max&sort=name', // Intel Xeon Max
      'https://www.techpowerup.com/cpu-specs/?mfgr=Intel&generation=Intel%20Xeon%20Phi&sort=name', // Intel Xeon Phi
    ],
  },
  {
    company: 'AMD',
    urls: [
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20Model%204&sort=name', // AMD Athlon Model 4
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20XP&sort=name', // AMD Athlon XP
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Sempron&sort=name', // AMD Sempron
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Mobile%20Sempron&sort=name', // AMD Mobile Sempron
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%2064&sort=name', // AMD Athlon 64
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%2064%20FX&sort=name', // AMD Athlon 64 FX
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Mobile%20Athlon%2064&sort=name', // AMD Mobile Athlon 64
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%2064%20X2&sort=name', // AMD Athlon 64 X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Turion%2064&sort=name', // AMD Turion 64
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Sempron%20X2&sort=name', // AMD Sempron X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20X2&sort=name', // AMD Athlon X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20X3&sort=name', // AMD Phenom X3
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20X4&sort=name', // AMD Phenom X4
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20II%20X2&sort=name', // AMD Athlon II X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20II%20X2&sort=name', // AMD Phenom II X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20II%20X3&sort=name', // AMD Athlon II X3
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20II%20X3&sort=name', // AMD Phenom II X3
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon%20II%20X4&sort=name', // AMD Athlon II X4
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20II%20X4&sort=name', // AMD Phenom II X4
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Phenom%20II%20X6&sort=name', // AMD Phenom II X6
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Turion%20X2%20Ultra&sort=name', // AMD Turion X2 Ultra
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Turion%20X2&sort=name', // AMD Turion X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20C&sort=name', // AMD C
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Z&sort=name', // AMD Z
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20E1&sort=name', // AMD E1
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20E2&sort=name', // AMD E2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A4&sort=name', // AMD A4
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A6&sort=name', // AMD A6
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A8&sort=name', // AMD A8
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20E&sort=name', // AMD E
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Athlon&sort=name', // AMD Athlon
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A9&sort=name', // AMD A9
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A10&sort=name', // AMD A10
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20FirePro&sort=name', // AMD FirePro
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20FX&sort=name', // AMD FX
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20A12&sort=name', // AMD A12
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%203&sort=name', // AMD Ryzen 3
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%205&sort=name', // AMD Ryzen 5
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%207&sort=name', // AMD Ryzen 7
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%20Threadripper&sort=name', // AMD Ryzen Threadripper
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%20Embedded&sort=name', // AMD Ryzen Embedded
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Ryzen%209&sort=name', // AMD Ryzen 9
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Opteron&sort=name', // AMD Opteron
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20Opteron%20X2&sort=name', // AMD Opteron X2
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20EPYC&sort=name', // AMD EPYC
      'https://www.techpowerup.com/cpu-specs/?mfgr=AMD&generation=AMD%20EPYC%20Embedded&sort=name', // AMD EPYC Embedded
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
  _execution: AutomationAction,
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

  // Trigger auto-archive
  await context.api.post('products/sources/auto-archive', null);

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateCpuSourcesDate: new Date().getTime(),
  };
}

async function getTechPowerUpSources() {
  console.log('Scraping CPU Sources from TechPowerUp');

  const map: Record<string, TechPowerUpCpuSource> = {};
  for (let i = 0; i < TECHPOWERUP_URLS.length; ++i) {
    const { company, urls } = TECHPOWERUP_URLS[i];

    const randomizedUrls = urls
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    for (const url of randomizedUrls) {
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
      await sleep(DELAY_BETWEEN_TECHPOWERUP_REQUEST);
    }
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Cpu,
    sourceName: `${value.company} ${value.name}`.trim(),
    sourceKey: CpuDataSourceKey.TechPowerUp,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return sources;
}

async function getPassMarkSources() {
  console.log('Scraping CPU Sources from PassMark');

  const map: Record<string, PassMarkCpuSource> = {};
  for (let i = 0; i < PASSMARK_URLS.length; ++i) {
    const url = PASSMARK_URLS[i];
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

    await sleep(DELAY_BETWEEN_SOURCE_REQUEST);
  }

  const sources: ProductSource[] = Object.values(map).map((value) => ({
    productType: ProductType.Cpu,
    sourceName: `${value.company} ${value.name}`.trim(),
    sourceKey: CpuDataSourceKey.PassMark,
    sourceUrl: value.url,
  }));

  console.log(`Scraped ${sources.length} PassMark sources`);

  return sources;
}

async function getGeekBenchSources() {
  console.log('Scraping CPU Sources from GeekBench');

  const geekBenchSources = await scrapeGeekBenchCpuSources({});
  await sleep(DELAY_BETWEEN_SOURCE_REQUEST);

  const sources: ProductSource[] = Object.values(geekBenchSources).map(
    (value) => ({
      productType: ProductType.Cpu,
      sourceName: `${value.company} ${value.name}`.trim(),
      sourceKey: CpuDataSourceKey.GeekBench,
      sourceUrl: value.url,
    }),
  );

  console.log(`Scraped ${sources.length} GeekBench sources`);

  return sources;
}

async function uploadCpuSources(
  sources: ProductSource[],
  context: AutomationContext,
) {
  console.log('Upload CPU sources to API.');

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
