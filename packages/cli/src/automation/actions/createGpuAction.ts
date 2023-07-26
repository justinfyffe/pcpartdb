import { scrapeGpu } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CreateGpuActionData,
  CreateProductUpdateRequest,
  generateGpuSlug,
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
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

  // Scrape the GPU data from our sources.
  const gpu = await fetchGpuData({
    sources: {
      [GpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [GpuDataSourceKey.VideocardBenchmarks]: passMarkSource,
      [GpuDataSourceKey.UlBenchmarks]: ulBenchmarkSource,
    },
  });
  if (gpu == null) {
    // No results for scraping. Skip.
    console.error(
      `No scraped data when scraping GPU during automation for action=${action}`,
    );
    return;
  }

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

async function fetchGpuData(options: {
  sources: Record<string, GpuDataSource>;
}) {
  console.info('Fetching GPU data', options.sources);

  // Scrape the GPU data from our sources.
  let scrapedGpu: Gpu;
  try {
    const result = await scrapeGpu(options);
    scrapedGpu = result.product as Gpu;

    console.log('Finished fetching data.');
    return scrapedGpu;
  } catch (e) {
    // Could not scrape the GPU. Skip as we do not have data.
    console.error('Error when scraping GPU during automation');
    console.error(e);
    return null;
  }
}

async function uploadProductUpdate(gpu: Gpu, context: AutomationContext) {
  const update: GpuUpdate = {
    productType: ProductType.Gpu,
    productName: gpu.name,
    productCompany: productFieldValue(gpu.company),
    description: `Create GPU for ${gpu.name}`,
    status: ProductUpdateStatus.Pending,
    data: { original: null, updated: gpu },
    metadata: {},
  };

  console.info('Uploading pending creation for GPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
  );
  console.info('Finshed uploading pending creation for GPU');
}
