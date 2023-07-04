import {
  Cpu,
  CpuProductionStatusValue,
  hasCpuLaunched,
  isPastCpuLaunchDate,
  ProductType,
  ViewCpuContentData,
} from '@pcpartdb/shared';
import {
  formatCpuField,
  formatCpuName,
  formatProductField,
} from 'packages/website/src/client/product';
import { ContentParams } from 'packages/website/src/client/shared/content';
import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';

export interface ViewCpuContentParams {
  company?: string;
  shortCpuName?: string;
  launchPrice?: string;
  releaseDate?: string;
  marketSegments?: string;
  architecture?: string;
  codename?: string;
  generation?: string;
  socket?: string;
  foundry?: string;
  processSize?: string;
  anUnreleasedOrAnEndOfLife?: string;
  wasPlannedToLaunchOrLaunchedOrWillLaunch?: string;

  memorySupport?: string;
  memoryChannels?: string;
  pciExpress?: string;
  coresCount?: string;
  threadsCount?: string;
  clock?: string;
  boostClock?: string;
  l1Cache?: string;
  l2Cache?: string;
  l3Cache?: string;
  integratedGraphics?: string;
  bundledCooler?: string;

  performanceRating?: string;
  performanceRank?: string;
  performanceRankForCodename?: string;
  performanceRankForGeneration?: string;
  bestPerformanceDifference?: string;
  bestPerformanceCpuName?: string;
  bestPerformanceShortCpuName?: string;
  totalPerformanceCpus?: string;

  valueRating?: string;
  valueRank?: string;
  valueRankForSegment?: string;
}

export function getContentParams(cpu: Cpu, contentData: ViewCpuContentData) {
  return {
    ...getGeneralParams(cpu, contentData),
    ...getPerformanceParams(cpu, contentData),
    ...getValueParams(cpu),
    ...getSpecsParams(cpu),
  } as ViewCpuContentParams as ContentParams;
}

function getGeneralParams(cpu: Cpu, _contentData: ViewCpuContentData) {
  let anUnreleasedOrAnEndOfLife: string = null;
  if (cpu.productionStatus?.value === CpuProductionStatusValue.EndOfLife) {
    anUnreleasedOrAnEndOfLife = 'an end-of-life';
  } else if (
    cpu.productionStatus?.value === CpuProductionStatusValue.Unreleased
  ) {
    anUnreleasedOrAnEndOfLife = 'an unreleased';
  }

  let wasPlannedToLaunchOrLaunchedOrWillLaunch: string = null;
  if (hasCpuLaunched(cpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'launched';
  } else if (isPastCpuLaunchDate(cpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'was planned to launch';
  } else {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'will launch';
  }

  return {
    company: formatProductField(ProductType.Cpu, cpu.company),
    cpuName: formatCpuName(cpu),
    shortCpuName: formatCpuName(cpu, { company: false }),
    launchPrice: formatCpuField(cpu.launchPrice),
    releaseDate: formatCpuField(cpu.releaseDate),
    marketSegments: formatCpuField(cpu.marketSegments).toLowerCase(),
    architecture: formatCpuField(cpu.architecture),
    codename: formatCpuField(cpu.codename),
    generation: formatCpuField(cpu.generation),
    socket: formatCpuField(cpu.socket),
    foundry: formatCpuField(cpu.foundry),
    processSize: formatCpuField(cpu.processSize),
    anUnreleasedOrAnEndOfLife,
    wasPlannedToLaunchOrLaunchedOrWillLaunch,
  } as ViewCpuContentParams as ContentParams;
}

function getPerformanceParams(cpu: Cpu, contentData: ViewCpuContentData) {
  const performanceRating = formatCpuField(cpu.performanceScore);
  const performanceRank =
    cpu.ranks?.performanceRank > 1
      ? formatOrdinalNumber(cpu.ranks?.performanceRank)
      : '';

  const bestPerformanceCpu = contentData.bestPerformanceCpu;
  const bestPerformanceDifference = (
    100 *
    (cpu.performanceScore?.value / bestPerformanceCpu?.performanceScore?.value)
  ).toFixed(2);
  const bestPerformanceCpuName = formatCpuName(bestPerformanceCpu);
  const bestPerformanceShortCpuName = formatCpuName(bestPerformanceCpu, {
    company: false,
  });

  const performanceRankForCodename =
    cpu.ranks?.performanceRankForCodename != null
      ? cpu.ranks.performanceRankForCodename > 1
        ? formatOrdinalNumber(cpu.ranks.performanceRankForCodename)
        : ''
      : null;
  const performanceRankForGeneration =
    cpu.ranks?.performanceRankForGeneration != null
      ? cpu.ranks.performanceRankForGeneration > 1
        ? formatOrdinalNumber(cpu.ranks.performanceRankForGeneration)
        : ''
      : null;

  const totalPerformanceCpus = String(contentData.totalPerformanceCpus);

  return {
    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceCpuName,
    bestPerformanceShortCpuName,
    performanceRankForCodename,
    performanceRankForGeneration,
    totalPerformanceCpus,
  } as ViewCpuContentParams as ContentParams;
}

function getValueParams(cpu: Cpu) {
  const valueRating = formatCpuField(cpu.valueScore);
  const valueRank =
    cpu.ranks?.valueRank > 1 ? formatOrdinalNumber(cpu.ranks?.valueRank) : '';
  const valueRankForSegment =
    cpu.ranks?.valueRankForSegment > 1
      ? formatOrdinalNumber(cpu.ranks?.valueRankForSegment)
      : '';

  return {
    valueRating,
    valueRank,
    valueRankForSegment,
  } as ViewCpuContentParams as ContentParams;
}

function getSpecsParams(cpu: Cpu) {
  return {
    memorySupport: formatCpuField(cpu.memorySupport),
    memoryChannels: formatCpuField(cpu.memoryChannels).toLowerCase(),
    pciExpress: formatCpuField(cpu.pciExpress),
    coresCount: formatCpuField(cpu.coresCount),
    threadsCount: formatCpuField(cpu.threadsCount),
    clock: formatCpuField(cpu.clock),
    boostClock: formatCpuField(cpu.turboClock),
    l1Cache: formatCpuField(cpu.l1Cache),
    l2Cache: formatCpuField(cpu.l2Cache),
    l3Cache: formatCpuField(cpu.l3Cache),
    integratedGraphics: formatCpuField(cpu.integratedGraphics),
    bundledCooler: formatCpuField(cpu.bundledCooler),
  } as ViewCpuContentParams as ContentParams;
}
