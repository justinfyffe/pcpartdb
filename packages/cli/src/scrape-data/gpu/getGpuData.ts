import { scrapeTechPowerUpGpuDetails } from '@pcpartdb/scraper';
import { generateGpuSlug, Gpu, GpuDataSourceKey } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { GpuSource, GpuSourceModel } from '../../scrape-sources/gpu/types';
import { sleep } from '../../shared/process';
import { outputPath } from './utils';

const SLEEP_DELAY = 45_000;

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
    const source = sourceModel[i];

    console.log(`Scraping GPU data for i=${i}`);
    try {
      const gpu = await scrapeGpuData(source, noProxy);
      gpus.push(gpu);
    } catch (err) {
      console.error('Encountered error when scraping.');
      console.error(err);
    }

    await sleep(SLEEP_DELAY);
  }

  console.log(`Fetched ${gpus.length}`);

  const path = outputPath(file);
  console.log(`Finished building GPU data. Saving to ${path}`);

  await fsPromises.writeFile(path, JSON.stringify(gpus, undefined, 2), 'utf-8');
}

async function scrapeGpuData(source: GpuSource, noProxy?: boolean) {
  if (source.techPowerUpUrl == null) {
    throw new Error(`Missing TechPowerUp URL for ${source.name}`);
  }

  console.log(`Scraping ${source.name} - ${source.techPowerUpUrl}`);
  const data = await scrapeTechPowerUpGpuDetails({
    url: source.techPowerUpUrl,
    noProxy,
  });

  console.log(`Decorating ${source.name}`);
  return decorateGpu(data.product as Partial<Gpu>, source);
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
