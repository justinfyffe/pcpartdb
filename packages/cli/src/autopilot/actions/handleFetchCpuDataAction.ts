import { scrapeCpu } from '@pcpartdb/scraper';
import {
  AutopilotApproval,
  AutopilotApprovalStatus,
  AutopilotApprovalType,
  canAutoUpdateProductField,
  Cpu,
  CpuDataApproval,
  CpuDataSource,
  CpuDataSourceKey,
  CpuField,
  FetchCpuDataAction,
  hasProductFieldValue,
  productFieldValue,
} from '@pcpartdb/shared';
import deepmerge from 'deepmerge';
import { compare as generateJsonPatch } from 'fast-json-patch';
import { AutopilotContext } from '../types';

export async function handleFetchCpuDataAction(
  action: FetchCpuDataAction,
  context: AutopilotContext,
) {
  const { cpuId } = action;
  let { techPowerUpUrl, passMarkUrl, geekBenchUrl } = action;

  // If there is an existing CPU, then use the sources from that instead.
  let cpu: Cpu = null;
  if (cpuId != null) {
    cpu = await context.api.get(`/products/cpu/${cpuId}`);
    techPowerUpUrl =
      cpu.meta?.dataSources?.[CpuDataSourceKey.TechPowerUp]?.url || null;
    passMarkUrl =
      cpu.meta?.dataSources?.[CpuDataSourceKey.PassMark]?.url || null;
    geekBenchUrl =
      cpu.meta?.dataSources?.[CpuDataSourceKey.GeekBench]?.url || null;
  }

  // Scrape the CPU data from our sources.
  // Check if we have any results from scraping. Skip if we don't.
  const scrapedCpu = await fetchCpuData({
    sources: {
      [CpuDataSourceKey.TechPowerUp]: { url: techPowerUpUrl },
      [CpuDataSourceKey.PassMark]: { url: passMarkUrl },
      [CpuDataSourceKey.GeekBench]: { url: geekBenchUrl },
    },
  });
  if (scrapedCpu == null) {
    console.error(
      `No scraped data when scraping CPU during autopilot for action=${action}`,
    );
    return;
  }

  // Update benchmarks for existing CPU. These do not require approval.
  if (cpu != null) {
    await updateBenchmarks(cpu, scrapedCpu, context);
  }

  // Merge existing cpu with scraped data. Exclude auto-update disabled fields.
  const updatedCpu = mergeCpus(cpu, scrapedCpu);

  // Check if we have changes. Create an approval entry.
  if (hasUpdates(cpu, updatedCpu)) {
    const approval: AutopilotApproval<CpuDataApproval> = {
      description: '',
      status: AutopilotApprovalStatus.Pending,
      type: AutopilotApprovalType.CpuData,
      data: { type: cpuId == null ? 'new' : 'update', cpu: updatedCpu },
    };

    await context.api.post('/autopilot/approvals', approval);
  }
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
    console.error('Error when scraping CPU during autopilot');
    console.error(e);
    return null;
  }
}

async function updateBenchmarks(
  cpu: Cpu,
  scrapedCpu: Cpu,
  context: AutopilotContext,
) {
  if (cpu == null) {
    return;
  }

  let updated = false;
  if (
    hasProductFieldValue(scrapedCpu.cpuMarkMultiThread) &&
    canAutoUpdateProductField(scrapedCpu.cpuMarkMultiThread) &&
    productFieldValue<number>(scrapedCpu.cpuMarkMultiThread) > 0
  ) {
    cpu.cpuMarkMultiThread =
      scrapedCpu.cpuMarkMultiThread || cpu.cpuMarkMultiThread;
    updated = true;
  }

  if (
    hasProductFieldValue(scrapedCpu.cpuMarkSingleThread) &&
    canAutoUpdateProductField(scrapedCpu.cpuMarkSingleThread) &&
    productFieldValue<number>(scrapedCpu.cpuMarkSingleThread) > 0
  ) {
    cpu.cpuMarkSingleThread =
      scrapedCpu.cpuMarkSingleThread || cpu.cpuMarkSingleThread;
    updated = true;
  }

  if (
    hasProductFieldValue(scrapedCpu.geekbenchMultiCore) &&
    canAutoUpdateProductField(scrapedCpu.geekbenchMultiCore) &&
    productFieldValue<number>(scrapedCpu.geekbenchMultiCore) > 0
  ) {
    cpu.geekbenchMultiCore =
      scrapedCpu.geekbenchMultiCore || cpu.geekbenchMultiCore;
    updated = true;
  }

  if (
    hasProductFieldValue(scrapedCpu.geekbenchSingleCore) &&
    canAutoUpdateProductField(scrapedCpu.geekbenchSingleCore) &&
    productFieldValue<number>(scrapedCpu.geekbenchSingleCore) > 0
  ) {
    cpu.geekbenchSingleCore =
      scrapedCpu.geekbenchSingleCore || cpu.geekbenchSingleCore;
    updated = true;
  }

  if (updated) {
    await context.api.put(`/products/cpu/${cpu.id}`, cpu);
  }
}

function mergeCpus(cpu: Cpu, scrapedCpu: Cpu) {
  const filteredMerge = (target: unknown, source: unknown) => {
    const field = target as CpuField;

    // Auto-updating is disabled. Skip merging.
    if (field?.meta?.autoUpdate != null && field.meta.autoUpdate === false) {
      return target;
    }

    return deepmerge(target, source, { customMerge: () => filteredMerge });
  };
  return deepmerge(cpu, scrapedCpu, { customMerge: () => filteredMerge });
}

function hasUpdates(before: Cpu, after: Cpu) {
  const jsonPatch = generateJsonPatch(before, after);
  return jsonPatch.length > 0;
}
