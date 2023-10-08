import { scrapeTechPowerUpGpuRetailModelSources } from '@pcpartdb/scraper';
import {
  AutomationAction,
  AutomationSource,
  formatProductName,
  GetProductRequest,
  GpuProduct,
  ProductSourceKey,
  productSourceUrl,
  ProductType,
  UpdateGpuRetailModelSourcesActionData,
  UpsertAutomationSourcesRequest,
} from '@pcpartdb/shared';
import { sleep } from '../../shared/process';
import { AutomationContext } from '../types';

const BATCH_SIZE = 8;
const DELAY_BETWEEN_UPLOAD = 5_000;

export async function updateGpuRetailModelSourcesAction(
  action: AutomationAction<UpdateGpuRetailModelSourcesActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateGpuRetailModelSourcesAction');

  const chipset = await getChipset(payload.relatedProductId, context);

  // Scrape GPU Sources
  const techPowerUpSources = await getTechPowerUpRetailModelSources(chipset);

  // Upload CPU Sources
  await uploadGpuSources(techPowerUpSources, context);

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
  const gpu = await context.api.get<GpuProduct>(
    `/products/${chipsetId}`,
    { retries: 2 },
    {
      params: {
        req: { includeSources: true } as GetProductRequest,
      },
    },
  );
  if (gpu == null) {
    throw new Error(`Cannot find gpu for id=${chipsetId}`);
  }
  console.info(`Fetched Chipset: ${gpu.name}`);

  return gpu;
}

async function getTechPowerUpRetailModelSources(chipset: GpuProduct) {
  console.log('Scraping GPU chipset sources from TechPowerUp');
  const techPowerUpUrl = productSourceUrl(
    chipset,
    ProductSourceKey.TechPowerUp,
  );
  if (techPowerUpUrl == null) {
    return [];
  }

  const techPowerUpSources = await scrapeTechPowerUpGpuRetailModelSources({
    url: techPowerUpUrl,
  });

  const sources: AutomationSource[] = techPowerUpSources.map((value) => ({
    groupKey: value.groupKey,
    externalKey: value.externalKey,
    productType: ProductType.Gpu,
    sourceName: formatProductName({ company: value.company, name: value.name }),
    sourceKey: ProductSourceKey.TechPowerUp,
    sourceUrl: value.url,
    relatedProductId: chipset.id,
  }));

  console.log(`Scraped ${sources.length} TechPowerUp sources`);

  return sources;
}

async function uploadGpuSources(
  sources: AutomationSource[],
  context: AutomationContext,
) {
  console.log('Upload GPU sources to API.');

  // Create batches so we can upload multiple ones at a time.
  const batches: AutomationSource[][] = [];
  for (let i = 0; i < sources.length; i += BATCH_SIZE) {
    const batch = sources.slice(i, i + BATCH_SIZE);
    batches.push(batch);
  }

  // Upload sources via API
  let totalSources = 0;
  for (const batch of batches) {
    try {
      await context.api.post(
        'automation/sources',
        { sources: batch, autoArchive: true } as UpsertAutomationSourcesRequest,
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
