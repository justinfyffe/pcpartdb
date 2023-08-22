import { scrapeTechPowerUpGpuRetailModelSources } from '@pcpartdb/scraper';
import {
  AutoArchiveProductSourcesRequest,
  AutomationAction,
  Gpu,
  GpuDataSourceKey,
  GpuProductSource,
  ProductType,
  UpdateGpuRetailModelSourcesActionData,
  UpsertProductSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 10;
const DELAY_BETWEEN_UPLOAD = 10_000;

export async function updateGpuRetailModelSourcesAction(
  action: AutomationAction<UpdateGpuRetailModelSourcesActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuRetailModelSourcesAction');

  const chipset = await getChipset(payload.chipsetId, context);

  // Scrape GPU Sources
  const techPowerUpSources = await getTechPowerUpRetailModelSources(chipset);

  // Upload CPU Sources
  await uploadGpuSources(techPowerUpSources, context);

  // Trigger auto-archive
  await context.api.post(
    'products/sources/auto-archive',
    {
      productType: ProductType.Gpu,
      gpuChipsetId: payload.chipsetId,
    } as AutoArchiveProductSourcesRequest,
    { retries: 2 },
  );

  // Update execution details
  context.metadata = {
    ...(context.metadata ?? {}),
    updateGpuChipsetSourcesDate: new Date().getTime(),
  };
}

async function getChipset(chipsetId: number, context: AutomationContext) {
  if (chipsetId == null) {
    throw new Error(
      'Cannot update gpu retail model sources, missing chipset id',
    );
  }

  console.info(`Getting existing GPU for id=${chipsetId}`);
  const gpu = await context.api.get<Gpu>(`/products/gpus/${chipsetId}`, {
    retries: 2,
  });
  if (gpu == null) {
    throw new Error(`Cannot find gpu for id=${chipsetId}`);
  }
  console.info(`Fetched Chipset: ${gpu.name}`);

  return gpu;
}

async function getTechPowerUpRetailModelSources(chipset: Gpu) {
  console.log('Scraping GPU chipset sources from TechPowerUp');
  const techPowerUpUrl =
    chipset?.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp]?.url;
  if (techPowerUpUrl == null) {
    return [];
  }

  const techPowerUpSources = await scrapeTechPowerUpGpuRetailModelSources({
    url: techPowerUpUrl,
  });

  const sources: GpuProductSource[] = techPowerUpSources.map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: `${value.company || ''} ${value.name}`.trim(),
    sourceKey: GpuDataSourceKey.TechPowerUp,
    sourceUrl: value.url,
    gpuChipsetId: chipset.id,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return sources;
}

async function uploadGpuSources(
  sources: GpuProductSource[],
  context: AutomationContext,
) {
  console.log('Upload GPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: GpuProductSource[][] = [];
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
        { sources: batch } as UpsertProductSourcesRequest,
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
