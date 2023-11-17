import { scrapeGpu, ScrapeGpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  AutomationActionType,
  CreateAutomationActionRequest,
  CreateProductUpdateRequest,
  formatCompanyName,
  formatProductName,
  GetProductRequest,
  GPU_BENCHMARKS,
  GpuProduct,
  mergeProducts,
  productBenchmarkValue,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  setProductBenchmark,
  SubProductType,
  UpdateGpuActionData,
  UpdateGpuRetailModelSourcesActionData,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

export async function updateGpuAction(
  action: AutomationAction<UpdateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuAction', payload);

  // Get existing GPU
  let originalGpu: GpuProduct = await getGpu(payload.gpuId, context);

  // Get sources from gpu
  const sources = originalGpu.sources;

  // Get chipset source (if applicable)
  let chipset: GpuProduct;
  if (originalGpu?.parentId != null) {
    chipset = await getGpu(originalGpu?.parentId, context);
  }

  // Scrape the GPU data from our sources.
  const { product: scrapedGpu, hasRetailModels } = await fetchGpuData({
    chipset,
    sources,
  });

  // Merge and update benchmarks for existing GPU. These do not require approval.
  originalGpu = await updateBenchmarks(originalGpu, scrapedGpu, context);

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
  if (hasRetailModels && updatedGpu.parentId == null) {
    console.info('GPU has retail models. Request updating its sources');
    await createUpdateRetailModelSourcesAction(updatedGpu, context);
  }
}

async function getGpu(gpuId: number, context: AutomationContext) {
  if (gpuId == null) {
    throw new Error('Cannot update gpu, missing gpu id');
  }

  console.info(`Getting existing GPU for id=${gpuId}`);
  const gpu = await context.api.get<GpuProduct>(
    `/products/${gpuId}`,
    { retries: 2 },
    {
      params: {
        req: JSON.stringify({
          includeBenchmarks: true,
          includeImages: true,
          includeSources: true,
        } as GetProductRequest),
      },
    },
  );
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
  const product = result.product as GpuProduct;
  const hasRetailModels = result.hasRetailModels;

  console.log('Finished fetching data.');
  return { product, hasRetailModels };
}

async function updateBenchmarks(
  originalGpu: GpuProduct,
  scrapedGpu: GpuProduct,
  context: AutomationContext,
) {
  console.info('Checking for updated benchmarks');
  let updated = false;

  for (const benchmarkKey of GPU_BENCHMARKS) {
    const originalValue = productBenchmarkValue(originalGpu, benchmarkKey);
    const scrapedValue = productBenchmarkValue(scrapedGpu, benchmarkKey);

    if (scrapedValue != null && scrapedValue > 0) {
      setProductBenchmark(
        originalGpu,
        benchmarkKey,
        scrapedValue || originalValue,
      );
      updated = true;
    }
  }

  if (updated) {
    console.info('Update GPU with updated benchmarks');
    await context.api.put(
      `/products/${originalGpu.id}`,
      { product: originalGpu } as UpdateProductRequest,
      { retries: 2 },
    );
    console.info('Finished updating GPU with updated benchmarks');
  }

  return originalGpu;
}

function mergeGpus(originalGpu: GpuProduct, scrapedGpu: GpuProduct) {
  const result = mergeProducts(originalGpu, scrapedGpu) as GpuProduct;

  // Reset these might have been overwritten
  result.name = originalGpu.name;
  result.slug = originalGpu.slug;
  result.company = originalGpu.company;
  result.otherNames = originalGpu.otherNames;
  result.searchText = originalGpu.searchText;
  result.searchText = originalGpu.searchText;
  result.affiliateUrl = originalGpu.affiliateUrl;

  return result;
}

function hasUpdates(before: GpuProduct, after: GpuProduct) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalGpu: GpuProduct,
  updatedGpu: GpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(updatedGpu);
  const update: ProductUpdate = {
    productType: ProductType.Gpu,
    subProductType:
      updatedGpu.parentId == null
        ? SubProductType.GpuChipset
        : SubProductType.GpuRetailModel,
    productId: originalGpu.id,
    productName,
    description: `Update GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalGpu, updated: updatedGpu },
    metadata: {},
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
  chipset: GpuProduct,
  context: AutomationContext,
) {
  const name = `${formatCompanyName(chipset.company) || ''} ${
    chipset.name
  }`.trim();
  await context.api.post(
    '/automation/actions',
    {
      type: AutomationActionType.UpdateGpuRetailModelSources,
      description: `Update GPU Retail Model Sources for ${name}`,
      data: {
        relatedProductId: chipset.id,
      } as UpdateGpuRetailModelSourcesActionData,
    } as CreateAutomationActionRequest,
    { retries: 2 },
  );
}
