import { scrapeGpu } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CreateGpuActionData,
  CreateProductUpdateRequest,
  generateGpuSlug,
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  GpuProductType,
  GpuUpdate,
  parseProductName,
  productFieldValue,
  ProductType,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import { AutomationContext } from '../types';

export async function createGpuAction(
  action: AutomationAction<CreateGpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing createGpuAction', payload);

  // Get sources from gpu or action
  const sources = payload.sources;
  const techPowerUpSource = {
    url: sources?.filter(
      (source) => source.sourceKey === GpuDataSourceKey.TechPowerUp,
    )[0]?.sourceUrl,
  };
  const passMarkSource = {
    url: sources?.filter(
      (source) => source.sourceKey === GpuDataSourceKey.VideocardBenchmarks,
    )[0]?.sourceUrl,
  };
  const ulBenchmarkSource = {
    url: sources?.filter(
      (source) => source.sourceKey === GpuDataSourceKey.UlBenchmarks,
    )[0]?.sourceUrl,
  };

  // Get chipset source (if applicable)
  const chipset = await getChipset(payload.chipsetId, context);

  // Scrape the GPU data from our sources.
  const gpu = await fetchGpuData({
    chipset,
    sources: {
      [GpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [GpuDataSourceKey.VideocardBenchmarks]: passMarkSource,
      [GpuDataSourceKey.UlBenchmarks]: ulBenchmarkSource,
    },
  });

  // New GPUs have some additional data to be applied
  // Preferred name from source data.
  if (payload?.preferredName) {
    const { company, name } = parseProductName(payload.preferredName);
    gpu.name = name;
    if (company != null) {
      if (
        company.toLowerCase() !==
        productFieldValue<string>(gpu.company)?.toLowerCase()
      ) {
        gpu.company = {
          value: company,
          meta: { fieldKey: 'company', autoUpdate: false },
        };
      }
    }
  }

  // TODO: add preferred slug
  // Generate slug, new GPU didn't have it yet.
  gpu.slug = generateGpuSlug(gpu.name, productFieldValue(gpu.company));

  // Upload update
  await uploadProductUpdate(gpu, context);
}

async function getChipset(chipsetId: number, context: AutomationContext) {
  if (chipsetId == null) {
    return null;
  }

  console.info('Getting Chipset GPU');
  const chipset = await context.api.get<Gpu>(`/products/gpus/${chipsetId}`);
  if (chipset == null) {
    throw new Error('Could not get chipset');
  }
  console.log(`Finished getting chipset GPU: ${chipset.name}`);
  return chipset;
}

async function fetchGpuData(options: {
  chipset?: Gpu;
  sources: Record<string, GpuDataSource>;
}) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the GPU data from our sources.
  const result = await scrapeGpu(options);
  const product = result.product as Gpu;

  console.log('Finished fetching data.');
  return product;
}

async function uploadProductUpdate(gpu: Gpu, context: AutomationContext) {
  const productName = `${productFieldValue(gpu.company) || ''} ${
    gpu.name
  }`.trim();
  const update: GpuUpdate = {
    productType: ProductType.Gpu,
    productName,
    description: `Create GPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: gpu },
    metadata: {},
    gpuProductType:
      gpu.chipsetId == null
        ? GpuProductType.Chipset
        : GpuProductType.RetailModel,
  };

  console.info('Uploading pending creation for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
  );
  console.info('Finshed uploading pending creation for GPU');
}
