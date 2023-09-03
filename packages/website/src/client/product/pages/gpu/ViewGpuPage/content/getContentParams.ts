import {
  DateFormat,
  formatGpuDimensions,
  formatGpuField,
  formatGpuName,
  getGpuChipset,
  getViewGpuPath,
  Gpu,
  GpuProductionStatusValue,
  hasGpuLaunched,
  isPastGpuLaunchDate,
  ViewGpuContentData,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';
import { formatOrdinalNumber } from 'packages/website/src/client/shared/format';

export interface ViewGpuContentParams {
  architecture?: string;
  chipsetCompany?: string;
  chipsetLaunchPrice?: string;
  chipsetName?: string;
  chipsetShortName?: string;
  chipsetShortestName?: string;
  codename?: string;
  company?: string;
  gpuName?: string;
  shortGpuName?: string;
  shortestGpuName?: string;
  launchPrice?: string;
  launchWindow?: string;
  marketSegment?: string;
  processSize?: string;
  releaseDate?: string;
  year?: string;
  totalRetailModels?: string;
  wasPlannedToLaunchOrLaunchedOrWillLaunch?: string;
  anUnreleasedOrAnEndOfLife?: string;

  dimensions?: string;
  height?: string;
  slotWidth?: string;
  slotWidthNoUnits?: string;
  slotWidthUnits?: string;
  outputs?: string;
  thickness?: string;

  psu?: string;
  tdp?: string;

  performanceRating?: string;
  performanceRank?: string;
  bestPerformanceDifference?: string;
  bestPerformanceSegmentGpuName?: string;
  bestPerformanceSegmentGpuShortName?: string;
  bestPerformanceSegmentGpuPath?: string;
  performanceRankForArchitectureSegment?: string;
  performanceRankForCompanySegment?: string;
  performanceRankForSegmentYear?: string;
  totalPerformanceGpus?: string;

  valueRating?: string;
  valueRank?: string;
  valueRankForSegment?: string;

  memorySize?: string;
  memoryType?: string;
  memoryClock?: string;
  memoryInterface?: string;
  memoryBandwidth?: string;
}

export function getContentParams(gpu: Gpu, contentData: ViewGpuContentData) {
  return {
    ...getGeneralParams(gpu, contentData),
    ...getCompatibilityParams(gpu),
    ...getPowerSupplyParams(gpu),
    ...getPerformanceParams(gpu, contentData),
    ...getValueParams(gpu),
    ...getMemoryParams(gpu),
  } as ViewGpuContentParams as ContentParams;
}

function getGeneralParams(gpu: Gpu, contentData: ViewGpuContentData) {
  const chipset = getGpuChipset(gpu);

  let wasPlannedToLaunchOrLaunchedOrWillLaunch: string = null;
  if (hasGpuLaunched(gpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'launched';
  } else if (isPastGpuLaunchDate(gpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'was planned to launch';
  } else {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'will launch';
  }

  let anUnreleasedOrAnEndOfLife: string = null;
  if (gpu.productionStatus?.value === GpuProductionStatusValue.EndOfLife) {
    anUnreleasedOrAnEndOfLife = 'an end-of-life';
  } else if (
    gpu.productionStatus?.value === GpuProductionStatusValue.Unreleased
  ) {
    anUnreleasedOrAnEndOfLife = 'an unreleased';
  }

  return {
    architecture: formatGpuField(gpu.architecture),
    chipsetCompany: formatGpuField(chipset.company),
    chipsetLaunchPrice: formatGpuField(chipset.launchPrice),
    chipsetName: formatGpuName(chipset),
    chipsetShortName: formatGpuName(chipset, { company: false }),
    chipsetShortestName: formatGpuName(chipset, {
      company: false,
      brand: false,
    }),
    codename: formatGpuField(gpu.codename),
    company: formatGpuField(gpu.company),
    gpuName: formatGpuName(gpu),
    shortGpuName: formatGpuName(gpu, { company: false }),
    shortestGpuName: formatGpuName(gpu, { company: false, brand: false }),
    launchPrice: formatGpuField(gpu.launchPrice),
    launchWindow: formatGpuField(gpu.releaseDate),
    marketSegment: formatGpuField(gpu.marketSegment)?.toLowerCase(),
    processSize: formatGpuField(gpu.processSize),
    releaseDate: formatGpuField(gpu.releaseDate),
    year: formatGpuField(gpu.releaseDate, { dateFormat: DateFormat.Year }),
    totalRetailModels: String(contentData.retailModels?.length || 0),
    wasPlannedToLaunchOrLaunchedOrWillLaunch,
    anUnreleasedOrAnEndOfLife,
  } as ViewGpuContentParams as ContentParams;
}

function getCompatibilityParams(gpu: Gpu) {
  const slots = gpu.slotWidth?.value;
  let thickness: string;
  if (slots > 3) {
    thickness = 'very large';
  } else if (slots > 2.5) {
    thickness = 'large';
  } else if (slots >= 2) {
    thickness = 'dual slot';
  } else if (slots >= 1.5) {
    thickness = 'low-profile';
  } else if (slots < 1.5) {
    thickness = 'compact, low-profile';
  }

  let outputs = formatGpuField(gpu.outputs);
  if (outputs === 'No outputs') {
    outputs = 'no';
  } else if (outputs === 'Portable Device Dependent') {
    outputs = null;
  }

  return {
    dimensions: formatGpuDimensions(gpu, { allowMissingDimensions: false }),
    height: formatGpuField(gpu.height),
    slotWidth: formatGpuField(gpu.slotWidth),
    slotWidthNoUnits: formatGpuField(gpu.slotWidth, { showUnits: false }),
    slotWidthUnits: gpu.slotWidth?.value === 1 ? 'slot' : 'slots',
    outputs,
    thickness,
  } as ViewGpuContentParams as ContentParams;
}

function getPowerSupplyParams(gpu: Gpu) {
  return {
    psu: formatGpuField(gpu.suggestedPsu),
    tdp: formatGpuField(gpu.thermalDesignPower),
  } as ViewGpuContentParams as ContentParams;
}

function getMemoryParams(gpu: Gpu) {
  return {
    memorySize: formatGpuField(gpu.memorySize),
    memoryType: formatGpuField(gpu.memoryType),
    memoryClock: formatGpuField(gpu.memoryClock),
    memoryInterface: formatGpuField(gpu.memoryInterface),
    memoryBandwidth: formatGpuField(gpu.memoryBandwidth),
  } as ViewGpuContentParams as ContentParams;
}

function getPerformanceParams(gpu: Gpu, contentData: ViewGpuContentData) {
  const chipset = getGpuChipset(gpu);

  const bestPerformanceSegmentGpu = contentData.bestPerformanceGpuForSegment;
  const bestPerformanceDifference = (
    100 *
    (chipset.performanceScore?.value /
      bestPerformanceSegmentGpu?.performanceScore?.value)
  ).toFixed(2);

  const performanceRating = formatGpuField(chipset.performanceScore);
  const performanceRank =
    gpu.ranks?.performanceRank > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRank)
      : '';
  const bestPerformanceSegmentGpuName = formatGpuName(
    bestPerformanceSegmentGpu,
  );
  const bestPerformanceSegmentGpuShortName = formatGpuName(
    bestPerformanceSegmentGpu,
    { company: false },
  );
  const performanceRankForArchitectureSegment =
    gpu.ranks?.performanceRankForArchitectureSegment != null
      ? gpu.ranks.performanceRankForArchitectureSegment > 1
        ? formatOrdinalNumber(gpu.ranks.performanceRankForArchitectureSegment)
        : ''
      : null;
  const bestPerformanceSegmentGpuPath =
    bestPerformanceSegmentGpu != null
      ? getViewGpuPath(bestPerformanceSegmentGpu)
      : null;
  const performanceRankForCompanySegment =
    gpu.ranks?.performanceRankForCompanySegment != null
      ? gpu.ranks.performanceRankForCompanySegment > 1
        ? formatOrdinalNumber(gpu.ranks.performanceRankForCompanySegment)
        : ''
      : null;
  const performanceRankForSegment =
    gpu.ranks?.performanceRankForSegment != null
      ? gpu.ranks.performanceRankForSegment > 1
        ? formatOrdinalNumber(gpu.ranks.performanceRankForSegment)
        : ''
      : null;
  const totalPerformanceGpus = String(contentData.totalPerformanceGpus);

  return {
    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceSegmentGpuName,
    bestPerformanceSegmentGpuShortName,
    bestPerformanceSegmentGpuPath,
    performanceRankForArchitectureSegment,
    performanceRankForCompanySegment,
    performanceRankForSegment,
    totalPerformanceGpus,
  } as ViewGpuContentParams as ContentParams;
}

function getValueParams(gpu: Gpu) {
  const chipset = getGpuChipset(gpu);
  const valueRating = formatGpuField(chipset.valueScore);
  const valueRank =
    gpu.ranks?.valueRank > 1 ? formatOrdinalNumber(gpu.ranks?.valueRank) : '';
  const valueRankForSegment =
    gpu.ranks?.valueRankForSegment > 1
      ? formatOrdinalNumber(gpu.ranks?.valueRankForSegment)
      : '';

  return {
    valueRating,
    valueRank,
    valueRankForSegment,
  } as ViewGpuContentParams as ContentParams;
}
