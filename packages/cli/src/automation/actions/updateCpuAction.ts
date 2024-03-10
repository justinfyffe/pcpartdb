import { scrapeCpu, ScrapeCpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  CPU_BENCHMARKS,
  CpuProduct,
  CreateProductUpdateRequest,
  formatProductName,
  GetProductRequest,
  mergeProducts,
  productBenchmarkValue,
  productFieldRawValue,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  setProductBenchmark,
  UpdateCpuActionData,
  UpdateProductRequest,
} from '@pcpartdb/shared';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

export async function updateCpuAction(
  action: AutomationAction<UpdateCpuActionData>,
  context: AutomationContext,
) {
  const { data: payload } = action;

  console.log('Executing updateCpuAction', payload);

  // Get existing CPU
  let originalCpu = await getCpu(payload.cpuId, context);

  // Get sources from cpu
  const sources = originalCpu.sources;

  // Scrape the CPU data from our sources.
  const scrapedCpu = await fetchCpuData({ sources });

  // Merge and update benchmarks for existing CPU. These do not require approval.
  originalCpu = await updateBenchmarks(originalCpu, scrapedCpu, context);

  // Merge existing cpu with scraped data. Exclude auto-update disabled fields.
  const updatedCpu = mergeCpus(originalCpu, scrapedCpu);

  // Check if we have changes. Upload the update.
  if (hasUpdates(originalCpu, updatedCpu)) {
    await uploadProductUpdate(originalCpu, updatedCpu, context);
  } else {
    console.info('CPU does not have any pending updates. Not uploading.');
  }
}

async function getCpu(cpuId: number, context: AutomationContext) {
  if (cpuId == null) {
    throw new Error('Cannot update cpu, missing cpu id');
  }

  console.info(`Getting existing CPU for id=${cpuId}`);
  const cpu = await context.api.get<CpuProduct>(
    `/products/${cpuId}`,
    { retries: 2 },
    {
      params: {
        req: JSON.stringify({
          includeAutomation: true,
          includeFields: true,
          includeBenchmarks: true,
          includeImages: true,
          includeSources: true,
        } as GetProductRequest),
      },
    },
  );
  if (cpu == null) {
    throw new Error(`Cannot find cpu for id=${cpuId}`);
  }
  console.info(`Fetched CPU: ${cpu.name}`);

  return cpu;
}

async function fetchCpuData(options: ScrapeCpuOptions) {
  console.info('Fetching CPU data', options.sources);

  // Scrape the CPU data from our sources.
  const result = await scrapeCpu(options);
  const scrapedCpu = result.product as CpuProduct;

  console.log('Finished fetching data.');
  return scrapedCpu;
}

async function updateBenchmarks(
  originalCpu: CpuProduct,
  scrapedCpu: CpuProduct,
  context: AutomationContext,
) {
  console.info('Checking for updated benchmarks');
  let updated = false;

  // We go for original first as msrp wouldn't have been approved yet.
  // It'll get recalculated when approved.
  const msrp =
    productFieldRawValue(originalCpu.fields?.msrp) ??
    productFieldRawValue(scrapedCpu.fields?.msrp) ??
    null;

  for (const benchmarkKey of CPU_BENCHMARKS) {
    const originalValue = productBenchmarkValue(originalCpu, benchmarkKey);
    const scrapedValue = productBenchmarkValue(scrapedCpu, benchmarkKey);

    if (scrapedValue != null && scrapedValue > 0) {
      const scrapedValuePerMsrp =
        msrp != null && msrp > 0 ? scrapedValue / msrp : null;

      setProductBenchmark(
        originalCpu,
        benchmarkKey,
        scrapedValue || originalValue,
        scrapedValuePerMsrp,
      );
      updated = true;
    }
  }

  if (updated) {
    console.info('Update CPU with updated benchmarks');
    await context.api.put(
      `/products/${originalCpu.id}`,
      { product: originalCpu } as UpdateProductRequest,
      { retries: 2 },
    );
    console.info('Finished updating CPU with updated benchmarks');
  }

  return originalCpu;
}

function mergeCpus(originalCpu: CpuProduct, scrapedCpu: CpuProduct) {
  const result = mergeProducts(originalCpu, scrapedCpu) as CpuProduct;

  // Reset as these might have been overwritten
  result.name = originalCpu.name;
  result.slug = originalCpu.slug;
  result.company = originalCpu.company;
  result.otherNames = originalCpu.otherNames;
  result.searchText = originalCpu.searchText;
  result.searchText = originalCpu.searchText;
  result.affiliateUrl = originalCpu.affiliateUrl;
  result.summary = originalCpu.summary;
  result.summaryPublishedAt = originalCpu.summaryPublishedAt;
  result.summaryStale = originalCpu.summaryStale;

  if (hasSummaryImpactingChanges(originalCpu, scrapedCpu)) {
    result.summaryStale = true;
  }

  return result;
}

function hasSummaryImpactingChanges(before: CpuProduct, after: CpuProduct) {
  return (
    before.fields?.productionStatus !== after.fields?.productionStatus ||
    before.fields?.marketSegment !== after.fields?.marketSegment ||
    before.fields?.releaseDate !== after.fields?.releaseDate ||
    before.fields?.msrp !== after.fields?.msrp ||
    before.fields?.tdp !== after.fields?.tdp ||
    before.fields?.processSize !== after.fields?.processSize ||
    before.fields?.socket !== after.fields?.socket ||
    before.fields?.cores !== after.fields?.cores ||
    before.fields?.pCores !== after.fields?.pCores ||
    before.fields?.eCores !== after.fields?.eCores ||
    before.fields?.threads !== after.fields?.threads ||
    before.fields?.codename !== after.fields?.codename ||
    before.fields?.architecture !== after.fields?.architecture ||
    before.fields?.clock !== after.fields?.clock ||
    before.fields?.turboClock !== after.fields?.turboClock ||
    before.fields?.multiplierUnlocked !== after.fields?.multiplierUnlocked ||
    before.fields?.l1Cache !== after.fields?.l1Cache ||
    before.fields?.l2Cache !== after.fields?.l2Cache ||
    before.fields?.l3Cache !== after.fields?.l3Cache ||
    before.fields?.memorySupport !== after.fields?.memorySupport ||
    before.fields?.memoryChannels !== after.fields?.memoryChannels ||
    before.fields?.pciExpress !== after.fields?.pciExpress ||
    before.fields?.integratedGraphics !== after.fields?.integratedGraphics ||
    before.fields?.bundledCooler !== after.fields?.bundledCooler
  );
}

function hasUpdates(before: CpuProduct, after: CpuProduct) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalCpu: CpuProduct,
  updatedCpu: CpuProduct,
  context: AutomationContext,
) {
  const productName = formatProductName(updatedCpu);
  const update: ProductUpdate = {
    productType: ProductType.Cpu,
    productId: originalCpu.id,
    productName,
    description: `Update CPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalCpu, updated: updatedCpu },
    metadata: {},
  };

  console.info('Uploading pending update for CPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending update for CPU');
}
