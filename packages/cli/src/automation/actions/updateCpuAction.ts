import { scrapeCpu, ScrapeCpuOptions } from '@pcpartdb/scraper';
import {
  AutomationAction,
  BenchmarKey,
  CpuProduct,
  CreateProductUpdateRequest,
  formatProductName,
  GetProductRequest,
  mergeProducts,
  productBenchmarkValue,
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
        req: {
          includeBenchmarks: true,
          includeImages: true,
          includeSources: true,
        } as GetProductRequest,
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

  // Update CPU Mark (multi-thread)
  const originalCpuMarkMulti = productBenchmarkValue(
    originalCpu,
    BenchmarKey.CpuMarkMultiThread,
  );
  const scrapedCpuMarkMulti = productBenchmarkValue(
    scrapedCpu,
    BenchmarKey.CpuMarkMultiThread,
  );
  if (scrapedCpuMarkMulti != null && scrapedCpuMarkMulti > 0) {
    setProductBenchmark(
      originalCpu,
      BenchmarKey.CpuMarkMultiThread,
      scrapedCpuMarkMulti || originalCpuMarkMulti,
    );
    updated = true;
  }

  // Update CPU Mark (single-thread)
  const originalCpuMarkSingle = productBenchmarkValue(
    originalCpu,
    BenchmarKey.CpuMarkSingleThread,
  );
  const scrapedCpuMarkSingle = productBenchmarkValue(
    scrapedCpu,
    BenchmarKey.CpuMarkSingleThread,
  );
  if (scrapedCpuMarkSingle != null && scrapedCpuMarkSingle > 0) {
    setProductBenchmark(
      originalCpu,
      BenchmarKey.CpuMarkSingleThread,
      scrapedCpuMarkSingle || originalCpuMarkSingle,
    );
    updated = true;
  }

  // Update GeekBench (multi-core)
  const originalGeekBenchMulti = productBenchmarkValue(
    originalCpu,
    BenchmarKey.GeekBenchMultiCore,
  );
  const scrapedGeekBenchMulti = productBenchmarkValue(
    scrapedCpu,
    BenchmarKey.GeekBenchMultiCore,
  );
  if (scrapedGeekBenchMulti != null && scrapedGeekBenchMulti > 0) {
    setProductBenchmark(
      originalCpu,
      BenchmarKey.GeekBenchMultiCore,
      scrapedGeekBenchMulti || originalGeekBenchMulti,
    );
    updated = true;
  }

  // Update GeekBench (single-core)
  const originalGeekBenchSingle = productBenchmarkValue(
    originalCpu,
    BenchmarKey.GeekBenchSingleCore,
  );
  const scrapedGeekBenchSingle = productBenchmarkValue(
    scrapedCpu,
    BenchmarKey.GeekBenchSingleCore,
  );
  if (scrapedGeekBenchSingle != null && scrapedGeekBenchSingle > 0) {
    setProductBenchmark(
      originalCpu,
      BenchmarKey.GeekBenchSingleCore,
      scrapedGeekBenchSingle || originalGeekBenchSingle,
    );
    updated = true;
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

  // Reset name and slug as these might have been overwritten
  result.name = originalCpu.name;
  result.slug = originalCpu.slug;

  return result;
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
