import { scrapeTechPowerUpGpuDetails } from '@pcpartdb/scraper';
import { generateGpuSlug, Gpu, GpuDataSourceKey } from '@pcpartdb/shared';
import * as fsPromises from 'fs/promises';
import { sleep } from '../shared/process';
import { RetailModelSource, RetailModelSources } from './types';
import { retailModelsDataPath } from './utils';

const SLEEP_DELAY = 15_000;

interface ScrapeRetailModelsOptions {
  sources: RetailModelSources;
  segments: number;
  proxy?: boolean;
}

export async function scrapeRetailModels(options: ScrapeRetailModelsOptions) {
  console.log('Scraping Retail Models from TechPowerUp');

  const { sources, segments, proxy } = options;

  let retailModels: Partial<Gpu>[] = [];

  for (let i = 0; i < sources.length; ++i) {
    console.log(`Scraping Retail Model for i=${i} of ${sources.length}`);
    const source = sources[i];

    const retailModel = await scrapeRetailModel(source, proxy);
    if (retailModel != null) {
      retailModels.push(retailModel);
    }

    const next = i + 1;
    if (next >= sources.length || next % segments === 0) {
      const segmentNumber = Math.ceil(next / segments);
      const path = retailModelsDataPath(
        `retail-models-${source.chipsetId}-segment-${segmentNumber}.json`,
      );
      await fsPromises.writeFile(
        path,
        JSON.stringify(retailModels, undefined, 2),
        'utf-8',
      );

      // Start next batch.
      retailModels = [];
    }

    await sleep(SLEEP_DELAY);
  }
}

export async function scrapeRetailModel(
  source: RetailModelSource,
  proxy?: boolean,
) {
  try {
    const { gpu } = await scrapeTechPowerUpGpuDetails({
      url: source.techPowerUpUrl,
      proxy,
    });

    return decorateGpu(gpu, source);
  } catch (err) {
    console.error('Encountered error when scraping.');
    console.error(err);
    return null;
  }
}

function decorateGpu(gpu: Partial<Gpu>, source: RetailModelSource) {
  gpu.chipsetId = source.chipsetId;
  gpu.company = {
    value: gpu.company?.value || source.company,
    meta: { fieldKey: 'company', autoUpdate: true },
  };

  gpu.marketSegment = {
    value: gpu.marketSegment?.value || source.marketSegment,
    meta: { fieldKey: 'marketSegment', autoUpdate: true },
  };

  gpu.meta = {
    dataSources: {
      [GpuDataSourceKey.TechPowerUp as string]: { url: source.techPowerUpUrl },
    },
  };

  gpu.slug = generateGpuSlug(gpu.name, gpu.company?.value);

  return gpu;
}
