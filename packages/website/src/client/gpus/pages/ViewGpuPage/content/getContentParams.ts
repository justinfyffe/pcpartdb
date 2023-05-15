import {
  getChipset,
  getViewGpuPath,
  Gpu,
  hasGpuLaunched,
  ViewGpuContentData,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';
import {
  DateFormatter,
  formatOrdinalNumber,
} from 'packages/website/src/client/shared/format';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '../../../utils';

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
  launchedOrWillLaunch?: string;

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
  totalPerformanceSegmentYearGpus?: string;

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
  const chipset = getChipset(gpu);

  return {
    architecture: formatGpuField(gpu.architecture),
    chipsetCompany: formatGpuField(chipset.company),
    chipsetLaunchPrice: formatGpuField(chipset.launchPrice),
    chipsetName: getGpuName(chipset),
    chipsetShortName: getGpuName(chipset, { company: false }),
    chipsetShortestName: getGpuName(chipset, { company: false, brand: false }),
    codename: formatGpuField(gpu.codename),
    company: formatGpuField(gpu.company),
    gpuName: getGpuName(gpu),
    shortGpuName: getGpuName(gpu, { company: false }),
    shortestGpuName: getGpuName(gpu, { company: false, brand: false }),
    launchPrice: formatGpuField(gpu.launchPrice),
    launchWindow: formatGpuField(gpu.releaseDate),
    marketSegment: formatGpuField(gpu.marketSegment)?.toLowerCase(),
    processSize: formatGpuField(gpu.processSize),
    releaseDate: formatGpuField(gpu.releaseDate),
    year: formatGpuField(gpu.releaseDate, {
      dateFormatter: DateFormatter.Year,
    }),
    totalRetailModels: String(contentData.retailModels?.length || 0),
    launchedOrWillLaunch: hasGpuLaunched(gpu) ? 'launched' : 'will launch',
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
  const chipset = getChipset(gpu);

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
  const bestPerformanceSegmentGpuName = getGpuName(bestPerformanceSegmentGpu);
  const bestPerformanceSegmentGpuShortName = getGpuName(
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
  const performanceRankForSegmentYear =
    gpu.ranks?.performanceRankForSegmentYear != null
      ? gpu.ranks.performanceRankForSegmentYear > 1
        ? formatOrdinalNumber(gpu.ranks.performanceRankForSegmentYear)
        : ''
      : null;
  const totalPerformanceGpus = String(contentData.totalPerformanceGpus);
  const totalPerformanceSegmentYearGpus = String(
    contentData.totalPerformanceSegmentYearGpus,
  );

  return {
    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceSegmentGpuName,
    bestPerformanceSegmentGpuShortName,
    bestPerformanceSegmentGpuPath,
    performanceRankForArchitectureSegment,
    performanceRankForCompanySegment,
    performanceRankForSegmentYear,
    totalPerformanceGpus,
    totalPerformanceSegmentYearGpus,
  } as ViewGpuContentParams as ContentParams;
}

function getValueParams(gpu: Gpu) {
  const chipset = getChipset(gpu);
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
