import { scrapeCpu, ScrapeCpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  canAutoUpdateProductField,
  Cpu,
  CpuDataSourceKey,
  CpuUpdate,
  CreateProductUpdateRequest,
  hasProductFieldValue,
  mergeProducts,
  productFieldValue,
  ProductType,
  ProductUpdateStatus,
  UpdateCpuActionData,
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
  const originalCpu = await getCpu(payload.cpuId, context);

  // Get sources from cpu
  const techPowerUpSource =
    originalCpu.meta?.dataSources?.[CpuDataSourceKey.TechPowerUp] || null;
  const passMarkSource =
    originalCpu.meta?.dataSources?.[CpuDataSourceKey.PassMark] || null;
  const geekBenchSource =
    originalCpu.meta?.dataSources?.[CpuDataSourceKey.GeekBench] || null;

  // Scrape the CPU data from our sources.
  const scrapedCpu = await fetchCpuData({
    sources: {
      [CpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [CpuDataSourceKey.PassMark]: passMarkSource,
      [CpuDataSourceKey.GeekBench]: geekBenchSource,
    },
    concurrency: context.concurrency ? 3 : 1,
    delayBetweenChunksMs: context.requestChunkDelay,
  });

  // Update benchmarks for existing CPU. These do not require approval.
  await updateBenchmarks(originalCpu, scrapedCpu, context);

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
  const cpu = await context.api.get<Cpu>(`/products/cpus/${cpuId}`, {
    retries: 2,
  });
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
  const scrapedCpu = result.product as Cpu;

  console.log('Finished fetching data.');
  return scrapedCpu;
}

async function updateBenchmarks(
  originalCpu: Cpu,
  scrapedCpu: Cpu,
  context: AutomationContext,
) {
  console.info('Checking for updated benchmarks');
  let updated = false;

  // Update CPU Mark (multi-thread)
  if (
    hasProductFieldValue(scrapedCpu.cpuMarkMultiThread) &&
    canAutoUpdateProductField(scrapedCpu.cpuMarkMultiThread) &&
    productFieldValue<number>(scrapedCpu.cpuMarkMultiThread) > 0
  ) {
    originalCpu.cpuMarkMultiThread =
      scrapedCpu.cpuMarkMultiThread || originalCpu.cpuMarkMultiThread;
    updated = true;
  }

  // Update CPU Mark (single-thread)
  if (
    hasProductFieldValue(scrapedCpu.cpuMarkSingleThread) &&
    canAutoUpdateProductField(scrapedCpu.cpuMarkSingleThread) &&
    productFieldValue<number>(scrapedCpu.cpuMarkSingleThread) > 0
  ) {
    originalCpu.cpuMarkSingleThread =
      scrapedCpu.cpuMarkSingleThread || originalCpu.cpuMarkSingleThread;
    updated = true;
  }

  // Update GeekBench (multi-core)
  if (
    hasProductFieldValue(scrapedCpu.geekbenchMultiCore) &&
    canAutoUpdateProductField(scrapedCpu.geekbenchMultiCore) &&
    productFieldValue<number>(scrapedCpu.geekbenchMultiCore) > 0
  ) {
    originalCpu.geekbenchMultiCore =
      scrapedCpu.geekbenchMultiCore || originalCpu.geekbenchMultiCore;
    updated = true;
  }

  // Update GeekBench (single-core)
  if (
    hasProductFieldValue(scrapedCpu.geekbenchSingleCore) &&
    canAutoUpdateProductField(scrapedCpu.geekbenchSingleCore) &&
    productFieldValue<number>(scrapedCpu.geekbenchSingleCore) > 0
  ) {
    originalCpu.geekbenchSingleCore =
      scrapedCpu.geekbenchSingleCore || originalCpu.geekbenchSingleCore;
    updated = true;
  }

  if (updated) {
    console.info('Update CPU with updated benchmarks');
    await context.api.put(`/products/cpus/${originalCpu.id}`, originalCpu, {
      retries: 2,
    });
    console.info('Finished updating CPU with updated benchmarks');
  }
}

function mergeCpus(originalCpu: Cpu, scrapedCpu: Cpu) {
  const result = mergeProducts(originalCpu, scrapedCpu);

  // Reset name and slug as these might have been overwritten
  result.name = originalCpu.name;
  result.slug = originalCpu.slug;

  return result;
}

function hasUpdates(before: Cpu, after: Cpu) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalCpu: Cpu,
  updatedCpu: Cpu,
  context: AutomationContext,
) {
  const productName = `${productFieldValue(updatedCpu.company) || ''} ${
    updatedCpu.name
  }`.trim();
  const update: CpuUpdate = {
    productType: ProductType.Cpu,
    productName,
    description: `Update CPU for ${productName}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalCpu, updated: updatedCpu },
    metadata: {},
    cpuId: originalCpu.id,
  };

  console.info('Uploading pending update for CPU');
  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
    { retries: 2 },
  );
  console.info('Finshed uploading pending update for CPU');
}
