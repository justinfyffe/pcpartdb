import { scrapeCpu } from '@pcpartdb/scraper';
import {
  canAutoUpdateProductField,
  Cpu,
  CpuDataSource,
  CpuDataSourceKey,
  CpuField,
  CreateProductUpdateRequest,
  FetchCpuDataAction,
  generateCpuSlug,
  hasProductFieldValue,
  ProductDiff,
  productFieldValue,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutomationContext } from '../types';

// TODO: branch this into two methods from this one
// One for handling source, and one for handling cpu id
export async function fetchCpuDataAction(
  action: FetchCpuDataAction,
  context: AutomationContext,
) {
  // Get existing CPU (if cpuId is provided)
  let originalCpu: Cpu;
  try {
    originalCpu = await getCpu(action.cpuId, context);
  } catch (e) {
    console.error(`Error getting existing CPU for action=${action}`);
    return;
  }

  // Get sources from cpu or action
  const sources = action.sources;
  const techPowerUpSource =
    originalCpu != null
      ? originalCpu.meta?.dataSources?.[CpuDataSourceKey.TechPowerUp] || null
      : {
          url: sources?.filter(
            (source) => source.sourceKey === CpuDataSourceKey.TechPowerUp,
          )[0]?.sourceUrl,
        };
  const passMarkSource =
    originalCpu != null
      ? originalCpu.meta?.dataSources?.[CpuDataSourceKey.PassMark] || null
      : {
          url: sources?.filter(
            (source) => source.sourceKey === CpuDataSourceKey.PassMark,
          )[0]?.sourceUrl,
        };
  const geekBenchSource =
    originalCpu != null
      ? originalCpu.meta?.dataSources?.[CpuDataSourceKey.GeekBench] || null
      : {
          url: sources?.filter(
            (source) => source.sourceKey === CpuDataSourceKey.GeekBench,
          )[0]?.sourceUrl,
        };

  // Scrape the CPU data from our sources.
  const scrapedCpu = await fetchCpuData({
    sources: {
      [CpuDataSourceKey.TechPowerUp]: techPowerUpSource,
      [CpuDataSourceKey.PassMark]: passMarkSource,
      [CpuDataSourceKey.GeekBench]: geekBenchSource,
    },
  });
  if (scrapedCpu == null) {
    // No results for scraping. Skip.
    console.error(
      `No scraped data when scraping CPU during automation for action=${action}`,
    );
    return;
  }

  // Update benchmarks for existing CPU. These do not require approval.
  if (originalCpu != null) {
    await updateBenchmarks(originalCpu, scrapedCpu, context);
  }

  // Merge existing cpu with scraped data. Exclude auto-update disabled fields.
  const updatedCpu = mergeCpus(originalCpu, scrapedCpu);

  // New CPUs have some additional data to be applied
  if (originalCpu == null) {
    // Preferred name from source
    if (action?.preferredName) {
      updatedCpu.name = action.preferredName;
    }

    // Generate slug, new CPU didn't have it yet.
    updatedCpu.slug = generateCpuSlug(
      updatedCpu.name,
      updatedCpu.company?.value,
    );
  }

  // Check if we have changes. Upload the update.
  if (hasUpdates(originalCpu, updatedCpu)) {
    await uploadProductUpdate(originalCpu, updatedCpu, context);
  }
}

async function getCpu(cpuId: number, context: AutomationContext) {
  if (cpuId == null) {
    return null;
  }

  const cpu = await context.api.get<Cpu>(`/products/cpu/${cpuId}`);
  if (cpu == null) {
    throw new Error(`Cannot find cpu for id=${cpuId}`);
  }

  return cpu;
}

async function fetchCpuData(options: {
  sources: Record<string, CpuDataSource>;
}) {
  // Scrape the CPU data from our sources.
  let scrapedCpu: Cpu;
  try {
    const result = await scrapeCpu(options);
    scrapedCpu = result.product as Cpu;
    return scrapedCpu;
  } catch (e) {
    // Could not scrape the CPU. Skip as we do not have data.
    console.error('Error when scraping CPU during automation');
    console.error(e);
    return null;
  }
}

async function updateBenchmarks(
  originalCpu: Cpu,
  scrapedCpu: Cpu,
  context: AutomationContext,
) {
  if (originalCpu == null) {
    return;
  }

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
    await context.api.put(`/products/cpu/${originalCpu.id}`, originalCpu);
  }
}

function mergeCpus(originalCpu: Cpu, scrapedCpu: Cpu) {
  const filteredMerge = (x: unknown, y: unknown) => {
    const field = x as CpuField;

    // Auto-updating is disabled. Skip merging.
    if (field?.meta?.autoUpdate != null && field.meta.autoUpdate === false) {
      return x;
    }

    return deepmerge(x, y, { customMerge: () => filteredMerge });
  };

  const result = deepmerge(originalCpu, scrapedCpu, {
    customMerge: () => filteredMerge,
  });

  // Reset name and slug as these might have been overwritten
  if (originalCpu != null) {
    result.name = originalCpu.name;
    result.slug = originalCpu.slug;
  }

  return result;
}

function hasUpdates(before: Cpu, after: Cpu) {
  if (before == null) {
    return true;
  }

  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}

async function uploadProductUpdate(
  originalCpu: Cpu,
  updatedCpu: Cpu,
  context: AutomationContext,
) {
  const update: ProductUpdate<ProductDiff> = {
    productType: ProductType.Cpu,
    productName: updatedCpu.name,
    productCompany: productFieldValue(updatedCpu.company),
    description: `Data update for ${updatedCpu.name}`,
    status: ProductUpdateStatus.Pending,
    data: { original: originalCpu, updated: updatedCpu },
    metadata: {},
  };

  await context.api.post(
    '/products/updates',
    update as CreateProductUpdateRequest,
  );
}
