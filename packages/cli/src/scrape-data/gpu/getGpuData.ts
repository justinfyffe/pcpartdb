import {
  scrapePassMarkGpuData,
  scrapeTechPowerUpGpuData,
  scrapeUlBenchmarksGpuData,
} from '@pcpartdb/scraper';
import {
  generateGpuSlug,
  Gpu,
  GpuDataSourceKey,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import * as fsPromises from 'fs/promises';
import { GpuSource, GpuSourceModel } from '../../scrape-sources/gpu/types';
import { sleep } from '../../shared/process';
import { outputPath } from './utils';

const SLEEP_DELAY_PER_GPU = 10_000;
const SLEEP_DELAY_PER_SOURCE = 5_000;

interface GetGpuDataOptions {
  sourceModel: GpuSourceModel;
  offset: number;
  count: number;
  noProxy?: boolean;
  file?: string;
}

export async function getGpuData(options: GetGpuDataOptions) {
  const { sourceModel, offset, count, noProxy, file } = options;
  const gpus: Partial<Gpu>[] = [];
  for (let i = offset; i < offset + count; ++i) {
    const source = sourceModel.sources[i];

    console.log(`Scraping GPU data for i=${i}`);
    try {
      const gpu = await scrapeGpuData(source, noProxy);
      gpus.push(gpu);
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }

    await sleep(SLEEP_DELAY_PER_GPU);
  }

  gpus.sort((gpu1, gpu2) => {
    if (
      hasProductFieldValue(gpu1.g3dMark) ||
      hasProductFieldValue(gpu2.g3dMark)
    ) {
      return (gpu2.g3dMark?.value ?? 0) - (gpu1.g3dMark?.value ?? 0);
    }

    return gpu1.name.localeCompare(gpu2.name);
  }); // cpu mark descending, then name ascending.

  console.log(`Fetched ${gpus.length}`);

  const path = outputPath(file);
  console.log(`Finished building GPU data. Saving to ${path}`);

  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
}

async function scrapeGpuData(source: GpuSource, noProxy?: boolean) {
  if (source.techPowerUpUrl == null) {
    throw new Error(`Missing TechPowerUp URL for ${source.name}`);
  }

  let gpu: Partial<Gpu> = {};
  if (source.techPowerUpUrl) {
    console.log(`Scraping ${source.name} - ${source.techPowerUpUrl}`);
    const response = await scrapeTechPowerUpGpuData({
      url: source.techPowerUpUrl,
      noProxy,
    });
    gpu = deepmerge(gpu, response.product as Partial<Gpu>);
  }

  await sleep(SLEEP_DELAY_PER_SOURCE);

  if (source.passMarkUrl) {
    console.log(`Scraping ${source.name} - ${source.passMarkUrl}`);
    const response = await scrapePassMarkGpuData({
      url: source.passMarkUrl,
      noProxy,
    });
    gpu = deepmerge(gpu, response.product as Partial<Gpu>);
  }

  await sleep(SLEEP_DELAY_PER_SOURCE);

  if (source.ulBenchmarksUrl) {
    console.log(`Scraping ${source.name} - ${source.ulBenchmarksUrl}`);
    const response = await scrapeUlBenchmarksGpuData({
      url: source.ulBenchmarksUrl,
      noProxy,
    });
    gpu = deepmerge(gpu, response.product as Partial<Gpu>);
  }

  await sleep(SLEEP_DELAY_PER_SOURCE);

  console.log(`Decorating ${source.name}`);
  return decorateGpu(gpu, source);
}

function decorateGpu(gpu: Partial<Gpu>, source: GpuSource) {
  gpu.meta = {
    dataSources: {
      [GpuDataSourceKey.TechPowerUp as string]: { url: source.techPowerUpUrl },
      [GpuDataSourceKey.UlBenchmarks as string]: {
        url: source.ulBenchmarksUrl,
      },
      [GpuDataSourceKey.VideocardBenchmarks as string]: {
        url: source.passMarkUrl,
      },
    },
  };

  gpu.slug = generateGpuSlug(gpu.name, gpu.company?.value);

  return gpu;
}
