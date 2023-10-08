import {
  CpuProduct,
  formatCompanyName,
  formatOrdinalNumber,
  formatProductName,
  hasCpuLaunched,
  hasProductFieldRawValue,
  isPastCpuLaunchDate,
  productFieldFormattedValue,
  productFieldRawValue,
  ProductionStatus,
  ViewCpuContentData,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content/types';

export interface ViewCpuContentParams {
  company?: string;
  shortCpuName?: string;
  launchPrice?: string;
  releaseDate?: string;
  marketSegment?: string;
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
  bestPerformanceDifference?: string;
  bestPerformanceCpuName?: string;
  bestPerformanceShortCpuName?: string;
  totalPerformanceCpus?: string;

  valueRating?: string;
  valueRank?: string;
  valueRankForSegment?: string;
}

export function getContentParams(
  cpu: CpuProduct,
  additionalData: ViewCpuContentData,
) {
  return {
    ...getGeneralParams(cpu, additionalData),
    ...getPerformanceParams(cpu, additionalData),
    ...getValueParams(cpu),
    ...getSpecsParams(cpu),
  } as ViewCpuContentParams as ContentParams;
}

function getGeneralParams(
  cpu: CpuProduct,
  _additionalData: ViewCpuContentData,
) {
  let anUnreleasedOrAnEndOfLife: string = null;
  if (
    productFieldRawValue(cpu.fields?.productionStatus) ===
    ProductionStatus.EndOfLife
  ) {
    anUnreleasedOrAnEndOfLife = 'an end-of-life';
  } else if (
    productFieldRawValue(cpu.fields?.productionStatus) ===
    ProductionStatus.Unreleased
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
    company: formatCompanyName(cpu.company),
    cpuName: formatProductName(cpu),
    shortCpuName: formatProductName(cpu, { company: false }),
    launchPrice: hasProductFieldRawValue(cpu.fields?.msrp)
      ? productFieldFormattedValue(cpu.fields?.msrp)
      : null,
    releaseDate: hasProductFieldRawValue(cpu.fields?.releaseDate)
      ? productFieldFormattedValue(cpu.fields?.releaseDate)
      : null,
    marketSegment: hasProductFieldRawValue(cpu.fields?.marketSegment)
      ? productFieldFormattedValue(cpu.fields?.marketSegment)?.toLowerCase()
      : null,
    architecture: hasProductFieldRawValue(cpu.fields?.architecture)
      ? productFieldFormattedValue(cpu.fields?.architecture)
      : null,
    codename: hasProductFieldRawValue(cpu.fields?.codename)
      ? productFieldFormattedValue(cpu.fields?.codename)
      : null,
    generation: hasProductFieldRawValue(cpu.fields?.generation)
      ? productFieldFormattedValue(cpu.fields?.generation)
      : null,
    socket: hasProductFieldRawValue(cpu.fields?.socket)
      ? productFieldFormattedValue(cpu.fields?.socket)
      : null,
    foundry: hasProductFieldRawValue(cpu.fields?.foundry)
      ? productFieldFormattedValue(cpu.fields?.foundry)
      : null,
    processSize: hasProductFieldRawValue(cpu.fields?.processSize)
      ? productFieldFormattedValue(cpu.fields?.processSize)
      : null,
    anUnreleasedOrAnEndOfLife,
    wasPlannedToLaunchOrLaunchedOrWillLaunch,
  } as ViewCpuContentParams as ContentParams;
}

function getPerformanceParams(
  cpu: CpuProduct,
  additionalData: ViewCpuContentData,
) {
  const performanceRating = hasProductFieldRawValue(
    cpu.fields?.performanceRating,
  )
    ? productFieldFormattedValue(cpu.fields?.performanceRating)
    : null;
  const performanceRank =
    cpu.ranks?.performanceRating > 1
      ? formatOrdinalNumber(cpu.ranks?.performanceRating)
      : '';

  const bestPerformanceCpu = additionalData.bestPerformanceCpu;
  const bestPerformanceDifference = (
    100 *
    (productFieldRawValue(cpu.fields?.performanceRating) /
      productFieldRawValue(bestPerformanceCpu.fields?.performanceRating))
  ).toFixed(2);
  const bestPerformanceCpuName = formatProductName(bestPerformanceCpu);
  const bestPerformanceShortCpuName = formatProductName(bestPerformanceCpu, {
    company: false,
  });

  const totalPerformanceCpus = String(additionalData.totalPerformanceCpus);

  return {
    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceCpuName,
    bestPerformanceShortCpuName,
    totalPerformanceCpus,
  } as ViewCpuContentParams as ContentParams;
}

function getValueParams(cpu: CpuProduct) {
  const valueRating = hasProductFieldRawValue(cpu.fields?.performancePerMsrp)
    ? productFieldFormattedValue(cpu.fields?.performancePerMsrp)
    : null;
  const valueRank =
    cpu.ranks?.performancePerMsrp > 1
      ? formatOrdinalNumber(cpu.ranks?.performancePerMsrp)
      : '';
  const valueRankForSegment =
    cpu.ranks?.performancePerMsrpForMarketSegment > 1
      ? formatOrdinalNumber(cpu.ranks?.performancePerMsrpForMarketSegment)
      : '';

  return {
    valueRating,
    valueRank,
    valueRankForSegment,
  } as ViewCpuContentParams as ContentParams;
}

function getSpecsParams(cpu: CpuProduct) {
  return {
    memorySupport: hasProductFieldRawValue(cpu.fields?.memorySupport)
      ? productFieldFormattedValue(cpu.fields?.memorySupport)
      : null,
    memoryChannels: hasProductFieldRawValue(cpu.fields?.memoryChannels)
      ? productFieldFormattedValue(cpu.fields?.memoryChannels)?.toLowerCase()
      : null,
    pciExpress: hasProductFieldRawValue(cpu.fields?.pciExpress)
      ? productFieldFormattedValue(cpu.fields?.pciExpress)
      : null,
    coresCount: hasProductFieldRawValue(cpu.fields?.cores)
      ? productFieldFormattedValue(cpu.fields?.cores)
      : null,
    threadsCount: hasProductFieldRawValue(cpu.fields?.threads)
      ? productFieldFormattedValue(cpu.fields?.threads)
      : null,
    clock: hasProductFieldRawValue(cpu.fields?.clock)
      ? productFieldFormattedValue(cpu.fields?.clock)
      : null,
    boostClock: hasProductFieldRawValue(cpu.fields?.turboClock)
      ? productFieldFormattedValue(cpu.fields?.turboClock)
      : null,
    l1Cache: hasProductFieldRawValue(cpu.fields?.l1Cache)
      ? productFieldFormattedValue(cpu.fields?.l1Cache)
      : null,
    l2Cache: hasProductFieldRawValue(cpu.fields?.l2Cache)
      ? productFieldFormattedValue(cpu.fields?.l2Cache)
      : null,
    l3Cache: hasProductFieldRawValue(cpu.fields?.l3Cache)
      ? productFieldFormattedValue(cpu.fields?.l3Cache)
      : null,
    integratedGraphics: productFieldFormattedValue(
      cpu.fields?.integratedGraphics,
    ),
    bundledCooler: productFieldFormattedValue(cpu.fields?.bundledCooler),
  } as ViewCpuContentParams as ContentParams;
}
