import { scrapeGpu } from '@pcpartdb/scraper';
import {
  AutomationAction,
  canAutoUpdateProductField,
  CreateProductUpdateRequest,
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  GpuField,
  GpuUpdate,
  hasProductFieldValue,
  productFieldValue,
  ProductType,
  ProductUpdateStatus,
  UpdateGpuActionData,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

export async function updateGpuAction(
  action: AutomationAction<UpdateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuAction', payload);

  // Get existing GPU
  let originalGpu: Gpu;
  try {
    originalGpu = await getGpu(payload.gpuId, context);
  } catch (e) {
    console.error(`Error getting existing GPU for action=${payload}`);
    return;
  }

  // Get sources from gpu
  const techPowerUpSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.TechPowerUp] || null;
  const passMarkSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.VideocardBenchmarks] ||
    null;
  const ulBenchmarkSource =
    originalGpu.meta?.dataSources?.[GpuDataSourceKey.UlBenchmarks] || null;

  // Scrape the GPU data from our sources.
  const scrapedGpu = await fetchGpuData({
    sources: {
      [GpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [GpuDataSourceKey.VideocardBenchmarks]: passMarkSource,
      [GpuDataSourceKey.UlBenchmarks]: ulBenchmarkSource,
    },
  });
  if (scrapedGpu == null) {
    // No results for scraping. Skip.
    console.error(
      `No scraped data when scraping GPU during automation for action=${payload}`,
    );
    return;
  }

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
}

async function getGpu(gpuId: number, context: AutomationContext) {
  if (gpuId == null) {
    throw new Error('Cannot update gpu, missing gpu id');
  }

  console.info(`Getting existing GPU for id=${gpuId}`);
  const gpu = await context.api.get<Gpu>(`/products/gpus/${gpuId}`);
  if (gpu == null) {
    throw new Error(`Cannot find gpu for id=${gpuId}`);
  }
  console.info(`Fetched GPU: ${gpu.name}`);

  return gpu;
}

async function fetchGpuData(options: {
  sources: Record<string, GpuDataSource>;
}) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the CPU data from our sources.
  let scrapedGpu: Gpu;
  try {
    const result = await scrapeGpu(options);
    scrapedGpu = result.product as Gpu;

    console.log('Finished fetching data.');
    return scrapedGpu;
  } catch (e) {
    // Could not scrape the GPU. Skip as we do not have data.
    console.error('Error when fetching GPU data during automation');
    console.error(e);
    return null;
  }
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
    await context.api.put(`/products/gpus/${originalGpu.id}`, originalGpu);
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
  const update: GpuUpdate = {
    gpuId: originalGpu.id,
    productType: ProductType.Gpu,
    productName: updatedGpu.name,
    productCompany: productFieldValue(updatedGpu.company),
    description: `Update GPU for ${updatedGpu.name}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalGpu, updated: updatedGpu },
    metadata: {},
  };

  console.info('Uploading pending update for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
  );
  console.info('Finshed uploading pending update for GPU');
}
