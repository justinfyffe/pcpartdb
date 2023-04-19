import { scrapeTechPowerUpGpuDetails } from '@pcpartdb/scraper';
import { generateGpuSlug, Gpu, GpuDataSourceKey } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { sleep } from '../shared/process';
import { GpuSource, GpuSourceModel } from './types';
import { gpusDataPath } from './utils';

const SLEEP_DELAY = 30_000;

interface GetGpuDataOptions {
  sourceModel: GpuSourceModel;
  offset: number;
  count: number;
  proxy?: boolean;
}

export async function getGpuData(options: GetGpuDataOptions) {
  const { sourceModel, offset, count, proxy } = options;
  const gpus: Partial<Gpu>[] = [];
  for (let i = offset; i < offset + count; ++i) {
    const source = sourceModel[i];

    console.log(`Scraping GPU data for i=${i}`);
    try {
      const gpu = await scrapeGpuData(source, proxy);
      gpus.push(gpu);
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }

    await sleep(SLEEP_DELAY);
  }

  console.log(`Fetched ${gpus.length}`);

  const path = gpusDataPath(`gpus-${new Date().getTime()}.json`);
  console.log(`Finished building GPU data. Saving to ${path}`);

  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
}

async function scrapeGpuData(source: GpuSource, proxy?: boolean) {
  if (source.techPowerUpUrl == null) {
    throw new Error(`Missing TechPowerUp URL for ${source.name}`);
  }

  console.log(`Scraping ${source.name} - ${source.techPowerUpUrl}`);
  const data = await scrapeTechPowerUpGpuDetails({
    url: source.techPowerUpUrl,
    proxy,
  });

  console.log(`Decorating ${source.name}`);
  return decorateGpu(data.gpu, source);
}

function decorateGpu(gpu: Partial<Gpu>, source: GpuSource) {
  gpu.marketSegment = {
    value: source.marketSegment,
    meta: { fieldKey: 'marketSegment', autoUpdate: true },
  };

  gpu.g3dMark = {
    value: source.g3dMark,
    meta: { fieldKey: 'g3dMark', autoUpdate: true },
  };

  gpu.g2dMark = {
    value: source.g2dMark,
    meta: { fieldKey: 'g2dMark', autoUpdate: true },
  };

  gpu.timespyGraphics = {
    value: source.timespyScore,
    meta: { fieldKey: 'timespyGraphics', autoUpdate: true },
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
