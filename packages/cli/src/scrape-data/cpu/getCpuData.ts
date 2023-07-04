import {
  scrapeGeekBenchCpuData,
  scrapePassMarkCpuData,
  scrapeTechPowerUpCpuData,
} from '@pcpartdb/scraper';
import {
  Cpu,
  CpuDataSourceKey,
  generateCpuSlug,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import * as fsPromises from 'fs/promises';
import { CpuSource, CpuSourceModel } from '../../scrape-sources/cpu/types';
import { sleep } from '../../shared/process';
import { outputPath } from './utils';

const SLEEP_DELAY_PER_CPU = 10_000;
const SLEEP_DELAY_PER_SOURCE = 5_000;

interface GetCpuDataOptions {
  sourceModel: CpuSourceModel;
  offset: number;
  count: number;
  noProxy?: boolean;
  file?: string;
}

export async function getCpuData(options: GetCpuDataOptions) {
  const { sourceModel, offset, count, noProxy, file } = options;
  const cpus: Partial<Cpu>[] = [];
  for (let i = offset; i < offset + count; ++i) {
    const source = sourceModel.sources[i];

    console.log(`Scraping CPU data for i=${i}`);
    try {
      const cpu = await scrapeCpuData(source, noProxy);
      cpus.push(cpu);
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }

    await sleep(SLEEP_DELAY_PER_CPU);
  }

  cpus.sort((cpu1, cpu2) => {
    if (
      hasProductFieldValue(cpu1.cpuMarkMultiThread) ||
      hasProductFieldValue(cpu2.cpuMarkMultiThread)
    ) {
      return (
        (cpu2.cpuMarkMultiThread?.value ?? 0) -
        (cpu1.cpuMarkMultiThread?.value ?? 0)
      );
    }

    return cpu1.name.localeCompare(cpu2.name);
  }); // cpu mark descending, then name ascending.

  console.log(`Fetched ${cpus.length}`);

  const path = outputPath(file);

  console.log('Finished building CPU data.');
  await fsPromises.writeFile(path, JSON.stringify(cpus, undefined, 2), 'utf-8');
  console.log(`Saved to ${path}`);
}

async function scrapeCpuData(source: CpuSource, noProxy?: boolean) {
  if (source.techPowerUpUrl == null) {
    throw new Error(`Missing TechPowerUp URL for ${source.name}`);
  }

  let cpu: Partial<Cpu> = {};
  if (source.techPowerUpUrl) {
    console.log(`Scraping ${source.name} - ${source.techPowerUpUrl}`);
    const response = await scrapeTechPowerUpCpuData({
      url: source.techPowerUpUrl,
      noProxy,
    });
    cpu = deepmerge(cpu, response.product as Partial<Cpu>);
  }

  await sleep(SLEEP_DELAY_PER_SOURCE);

  if (source.geekBenchUrl) {
    console.log(`Scraping ${source.name} - ${source.geekBenchUrl}`);
    const response = await scrapeGeekBenchCpuData({
      url: source.geekBenchUrl,
      noProxy,
    });
    cpu = deepmerge(cpu, response.product as Partial<Cpu>);
  }

  await sleep(SLEEP_DELAY_PER_SOURCE);

  if (source.passMarkUrl) {
    console.log(`Scraping ${source.name} - ${source.passMarkUrl}`);
    const response = await scrapePassMarkCpuData({
      url: source.passMarkUrl,
      noProxy,
    });
    cpu = deepmerge(cpu, response.product as Partial<Cpu>);
  }

  console.log(`Decorating ${source.name}`);
  return decorateCpu(cpu, source);
}

function decorateCpu(cpu: Partial<Cpu>, source: CpuSource) {
  cpu.meta = {
    dataSources: {
      [CpuDataSourceKey.TechPowerUp as string]: { url: source.techPowerUpUrl },
      [CpuDataSourceKey.GeekBench as string]: {
        url: source.geekBenchUrl,
      },
      [CpuDataSourceKey.PassMark as string]: {
        url: source.passMarkUrl,
      },
    },
  };

  cpu.slug = generateCpuSlug(cpu.name, cpu.company?.value);

  return cpu;
}
