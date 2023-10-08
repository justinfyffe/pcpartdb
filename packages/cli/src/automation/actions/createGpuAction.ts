import { scrapeGpu, ScrapeGpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CreateGpuActionData,
  CreateProductUpdateRequest,
  formatProductName,
  generateGpuSlug,
  GetProductRequest,
  GpuProduct,
  parseProductName,
  ProductSource,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  SubProductType,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

export async function createGpuAction(
  action: AutomationAction<CreateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing createGpuAction', payload);

  // Get sources from gpu or action
  const sources: ProductSource[] = payload.sources.map((source) => ({
    sourceKey: source.sourceKey,
    sourceUrl: source.sourceUrl,
  }));

  // Get chipset source (if applicable)
  const chipset = await getChipset(payload.relatedProductId, context);

  // Scrape the GPU data from our sources.
  const gpu = await fetchGpuData({
    chipset,
    sources,
  });
  gpu.sources = sources;

  // New GPUs have some additional data to be applied
  // Preferred name from source data.
  if (payload?.preferredName) {
    const { company, name } = parseProductName(payload.preferredName);
    gpu.name = name;
    if (company != null) {
      if (company.toLowerCase() !== gpu.company?.toLowerCase()) {
        gpu.company = company;
      }
    }
  }

  // Generate slug, new GPU doesn't have one yet.
  gpu.slug = payload?.preferredSlug || generateGpuSlug(gpu.name, gpu.company);

  // Upload update
  await uploadProductUpdate(gpu, context);
}

async function getChipset(chipsetId: number, context: AutomationContext) {
  if (chipsetId == null) {
    return null;
  }

  console.info('Getting Chipset GPU');
  const chipset = await context.api.get<GpuProduct>(
    `/products/${chipsetId}`,
    {
      retries: 2,
    },
    {
      params: {
        req: {
          includeBenchmarks: true,
          includeImages: true,
          includeSources: true,
        } as GetProductRequest,
      },
    },
  );
  if (chipset == null) {
    throw new Error('Could not get chipset');
  }
  console.log(`Finished getting chipset GPU: ${chipset.name}`);
  return chipset;
}

async function fetchGpuData(options: ScrapeGpuOptions) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the GPU data from our sources.
  const result = await scrapeGpu(options);
  const product = result.product as GpuProduct;

  console.log('Finished fetching data.');
  return product;
}

async function uploadProductUpdate(
  gpu: GpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(gpu);
  const update: ProductUpdate = {
    productType: ProductType.Gpu,
    subProductType:
      gpu.parentId == null
        ? SubProductType.GpuChipset
        : SubProductType.GpuRetailModel,
    productName,
    description: `Create GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: gpu },
    metadata: {},
  };

  console.info('Uploading pending creation for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending creation for GPU');
}
