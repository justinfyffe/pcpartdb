import { scrapeGpu, ScrapeGpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  AutomationActionType,
  canAutoUpdateProductField,
  CreateAutomationActionRequest,
  CreateProductUpdateRequest,
  Gpu,
  GpuDataSourceKey,
  GpuField,
  GpuProductType,
  GpuUpdate,
  hasProductFieldValue,
  productFieldValue,
  ProductType,
  ProductUpdateStatus,
  UpdateGpuActionData,
  UpdateGpuRetailModelSourcesActionData,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

const DEFAULT_DELAY = 30_000;

export async function updateGpuAction(
  action: AutomationAction<UpdateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuAction', payload);

  // Get existing GPU
  const originalGpu: Gpu = await getGpu(payload.gpuId, context);

  // Get sources from gpu
  const techPowerUpSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp] || null;
  const passMarkSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks] ||
    null;
  const ulBenchmarkSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks] || null;

  // Get chipset source (if applicable)
  let chipset: Gpu;
  if (originalGpu?.chipsetId != null) {
    chipset = await getGpu(originalGpu?.chipsetId, context);
  }

  // Scrape the GPU data from our sources.
  const { product: scrapedGpu, hasRetailModels } = await fetchGpuData({
    chipset,
    sources: {
      [GpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [GpuDataSourceKey.VideocardBenchmarks]: passMarkSource,
      [GpuDataSourceKey.UlBenchmarks]: ulBenchmarkSource,
    },
    concurrency: context.concurrency ? 3 : 1,
    delayBetweenChunksMs: context.requestChunkDelay || DEFAULT_DELAY,
  });

  // Update benchmarks for existing GPU. These do not require approval.
  await updateBenchmarks(originalGpu, scrapedGpu, context);

  // Merge existing gpu with scraped data. Exclude auto-update disabled fields.
  const updatedGpu = mergeGpus(originalGpu, scrapedGpu);

  // Check if we have changes. Upload the update.
  if (hasUpdates(originalGpu, updatedGpu)) {
    await uploadProductUpdate(originalGpu, updatedGpu, context);
  } else {
    console.info('GPU does not have any pending updates. Not uploading.');
  }

  // If the updated gpu is a chipset and has retail models, then we should
  // request to update its retail model sources.
  if (hasRetailModels && updatedGpu.chipsetId == null) {
    console.info('GPU has retail models. Request updating its sources');
    await createUpdateRetailModelSourcesAction(updatedGpu, context);
  }
}

async function getGpu(gpuId: number, context: AutomationContext) {
  if (gpuId == null) {
    throw new Error('Cannot update gpu, missing gpu id');
  }

  console.info(`Getting existing GPU for id=${gpuId}`);
  const gpu = await context.api.get<Gpu>(`/products/gpus/${gpuId}`, {
    retries: 2,
  });
  if (gpu == null) {
    throw new Error(`Cannot find gpu for id=${gpuId}`);
  }
  console.info(`Fetched GPU: ${gpu.name}`);

  return gpu;
}

async function fetchGpuData(options: ScrapeGpuOptions) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the CPU data from our sources.
  const result = await scrapeGpu(options);
  const product = result.product as Gpu;
  const hasRetailModels = result.hasRetailModels;

  console.log('Finished fetching data.');
  return { product, hasRetailModels };
}

async function updateBenchmarks(
  originalGpu: Gpu,
  scrapedGpu: Gpu,
  context: AutomationContext,
) {
  console.info('Checking for updated benchmarks');
  let updated = false;

  // Update G3D Mark
  if (
    hasProductFieldValue(scrapedGpu.g3dMark) &&
    canAutoUpdateProductField(scrapedGpu.g3dMark) &&
    productFieldValue<number>(scrapedGpu.g3dMark) > 0
  ) {
    originalGpu.g3dMark = scrapedGpu.g3dMark || originalGpu.g3dMark;
    updated = true;
  }

  // Update G2D Mark
  if (
    hasProductFieldValue(scrapedGpu.g2dMark) &&
    canAutoUpdateProductField(scrapedGpu.g2dMark) &&
    productFieldValue<number>(scrapedGpu.g2dMark) > 0
  ) {
    originalGpu.g2dMark = scrapedGpu.g2dMark || originalGpu.g2dMark;
    updated = true;
  }

  // Update TimeSpy Graphics
  if (
    hasProductFieldValue(scrapedGpu.timespyGraphics) &&
    canAutoUpdateProductField(scrapedGpu.timespyGraphics) &&
    productFieldValue<number>(scrapedGpu.timespyGraphics) > 0
  ) {
    originalGpu.timespyGraphics =
      scrapedGpu.timespyGraphics || originalGpu.timespyGraphics;
    updated = true;
  }

  if (updated) {
    console.info('Update GPU with updated benchmarks');
    await context.api.put(`/products/gpus/${originalGpu.id}`, originalGpu, {
      retries: 2,
    });
    console.info('Finished updating GPU with updated benchmarks');
  }
}

function mergeGpus(originalGpu: Gpu, scrapedGpu: Gpu) {
  const arrayMerge = (x: unknown[], y: unknown[]) => y;
  const filteredMerge = (x: unknown, y: unknown) => {
    const field = x as GpuField;

    // Auto-updating is disabled. Skip merging.
    if (field?.meta?.autoUpdate != null && field.meta.autoUpdate === false) {
      return x;
    }

    return deepmerge(x, y, {
      customMerge: () => filteredMerge,
      arrayMerge,
    });
  };

  const result = deepmerge(originalGpu, scrapedGpu, {
    customMerge: () => filteredMerge,
    arrayMerge,
  });

  // Reset name and slug as these might have been overwritten
  result.name = originalGpu.name;
  result.slug = originalGpu.slug;

  return result;
}

function hasUpdates(before: Gpu, after: Gpu) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalGpu: Gpu,
  updatedGpu: Gpu,
  context: AutomationContext,
) {
  const productName = `${productFieldValue(updatedGpu.company) || ''} ${
    updatedGpu.name
  }`.trim();
  const update: GpuUpdate = {
    productType: ProductType.Gpu,
    productName,
    description: `Update GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalGpu, updated: updatedGpu },
    metadata: {},
    gpuId: originalGpu.id,
    gpuProductType:
      updatedGpu.chipsetId == null
        ? GpuProductType.Chipset
        : GpuProductType.RetailModel,
  };

  console.info('Uploading pending update for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending update for GPU');
}

async function createUpdateRetailModelSourcesAction(
  chipset: Gpu,
  context: AutomationContext,
) {
  const name = `${productFieldValue(chipset.company) || ''} ${
    chipset.name
  }`.trim();
  await context.api.post(
    '/automation/actions',
    {
      type: AutomationActionType.UpdateGpuRetailModelSources,
      description: `Update GPU Retail Model Sources for ${name}`,
      data: { chipsetId: chipset.id } as UpdateGpuRetailModelSourcesActionData,
    } as CreateAutomationActionRequest,
    { retries: 2 },
  );
}
