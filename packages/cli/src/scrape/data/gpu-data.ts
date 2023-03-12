import { scrapeTechPowerUpGpuDetails } from '@pcpartdb/scraper';
import { generateGpuSlug, Gpu, GpuDataSourceKey } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { sleep } from '../../shared/process';
import { GpuSource, GpuSourceModel } from '../types';
import { gpusDataPath } from '../utils';

const SLEEP_DELAY = 60_000;

export async function getGpuData(
  sourceModel: GpuSourceModel,
  offset: number,
  count: number,
) {
  const gpus: Partial<Gpu>[] = [];
  for (let i = offset; i < offset + count; ++i) {
    const source = sourceModel[i];

    console.log(`Scraping GPU data for i=${i}`);
    const gpu = await scrapeGpuData(source);
    gpus.push(gpu);

    await sleep(SLEEP_DELAY);
  }

  console.log(`Fetched ${gpus.length}`);

  const path = gpusDataPath(`gpus-${new Date().getTime()}.json`);
  console.log(`Finished building GPU data. Saving to ${path}`);

  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
}

async function scrapeGpuData(source: GpuSource) {
  if (source.techPowerUpUrl == null) {
    throw new Error(`Missing TechPowerUp URL for ${source.name}`);
  }

  console.log(`Scraping ${source.name} - ${source.techPowerUpUrl}`);
  const data = await scrapeTechPowerUpGpuDetails(source.techPowerUpUrl);

  console.log(`Decorating ${source.name}`);
  return decorateGpu(data.gpu, source);
}

function decorateGpu(gpu: Partial<Gpu>, source: GpuSource) {
  gpu.marketSegment = {
    value: source.marketSegment,
    meta: {
      fieldKey: 'marketSegment',
      dataSource: {
        source: GpuDataSourceKey.VideocardBenchmarks,
        enabled: source.marketSegment != null,
      },
    },
  };

  gpu.benchmarks = {
    g3dMark: {
      value: source.g3dMark,
      meta: {
        fieldKey: 'g3dMark',
        dataSource: {
          source: GpuDataSourceKey.VideocardBenchmarks,
          enabled: source.g3dMark != null,
        },
      },
    },
    g2dMark: {
      value: source.g2dMark,
      meta: {
        fieldKey: 'g2dMark',
        dataSource: {
          source: GpuDataSourceKey.VideocardBenchmarks,
          enabled: source.g2dMark != null,
        },
      },
    },
    timespyGraphics: {
      value: source.timespyScore,
      meta: {
        fieldKey: 'timespyGraphics',
        dataSource: {
          source: GpuDataSourceKey.VideocardBenchmarks,
          enabled: source.timespyScore != null,
        },
      },
    },
  };

  gpu.meta = {
    dataSources: {
      [GpuDataSourceKey.TechPowerUp as string]: { url: source.techPowerUpUrl },
      [GpuDataSourceKey.UlBenchmarks as string]: {
        url: source.ulBenchmarksUrl,
      },
      [GpuDataSourceKey.VideocardBenchmarks as string]: {
        url: source.videocardBenchmarksUrl,
      },
    },
  };

  gpu.slug = generateGpuSlug(gpu.name, gpu.company?.value);

  return gpu;
}
