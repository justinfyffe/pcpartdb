import {
  formatCompanyName,
  formatGpuDimensions,
  formatOrdinalNumber,
  formatProductName,
  getGpuChipset,
  getViewGpuPath,
  GpuProduct,
  hasGpuLaunched,
  hasProductFieldRawValue,
  isPastGpuLaunchDate,
  productFieldFormattedValue,
  productFieldRawValue,
  ProductionStatus,
  ViewGpuAdditionalData,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content/types';

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
  totalRetailModels?: string;
  wasPlannedToLaunchOrLaunchedOrWillLaunch?: string;
  anUnreleasedOrAnEndOfLife?: string;

  dimensions?: string;
  height?: string;
  slotWidth?: string;
  slotOrSlots?: string;
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

export function getContentParams(
  gpu: GpuProduct,
  additionalData: ViewGpuAdditionalData,
) {
  return {
    ...getGeneralParams(gpu, additionalData),
    ...getCompatibilityParams(gpu),
    ...getPowerSupplyParams(gpu),
    ...getPerformanceParams(gpu, additionalData),
    ...getValueParams(gpu),
    ...getMemoryParams(gpu),
  } as ViewGpuContentParams as ContentParams;
}

function getGeneralParams(gpu: GpuProduct, contentData: ViewGpuAdditionalData) {
  const chipset = gpu.parent || gpu;

  let wasPlannedToLaunchOrLaunchedOrWillLaunch: string = null;
  if (hasGpuLaunched(gpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'launched';
  } else if (isPastGpuLaunchDate(gpu)) {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'was planned to launch';
  } else {
    wasPlannedToLaunchOrLaunchedOrWillLaunch = 'will launch';
  }

  let anUnreleasedOrAnEndOfLife: string = null;
  if (
    productFieldRawValue(gpu.fields?.productionStatus) ===
    ProductionStatus.EndOfLife
  ) {
    anUnreleasedOrAnEndOfLife = 'an end-of-life';
  } else if (
    productFieldRawValue(gpu.fields?.productionStatus) ===
    ProductionStatus.Unreleased
  ) {
    anUnreleasedOrAnEndOfLife = 'an unreleased';
  }

  return {
    architecture: hasProductFieldRawValue(gpu.fields?.architecture)
      ? productFieldFormattedValue(gpu.fields?.architecture)
      : null,
    chipsetCompany: formatCompanyName(chipset.company),
    chipsetLaunchPrice: hasProductFieldRawValue(chipset.fields?.msrp)
      ? productFieldFormattedValue(chipset.fields?.msrp)
      : null,
    chipsetName: formatProductName(chipset),
    chipsetShortName: formatProductName(chipset, { company: false }),
    chipsetShortestName: formatProductName(chipset, {
      company: false,
      brand: false,
    }),
    codename: hasProductFieldRawValue(gpu.fields?.codename)
      ? productFieldFormattedValue(gpu.fields?.codename)
      : null,
    company: formatCompanyName(gpu.company),
    gpuName: formatProductName(gpu),
    shortGpuName: formatProductName(gpu, { company: false }),
    shortestGpuName: formatProductName(gpu, { company: false, brand: false }),
    launchPrice: hasProductFieldRawValue(gpu.fields?.msrp)
      ? productFieldFormattedValue(gpu.fields?.msrp)
      : null,
    launchWindow: productFieldFormattedValue(gpu.fields?.releaseDate),
    marketSegment: hasProductFieldRawValue(gpu.fields?.marketSegment)
      ? productFieldFormattedValue(gpu.fields?.marketSegment)?.toLowerCase()
      : null,
    processSize: hasProductFieldRawValue(gpu.fields?.processSize)
      ? productFieldFormattedValue(gpu.fields?.processSize)
      : null,
    releaseDate: hasProductFieldRawValue(gpu.fields?.releaseDate)
      ? productFieldFormattedValue(gpu.fields?.releaseDate)
      : null,
    totalRetailModels: String(contentData.retailModels?.length || 0),
    wasPlannedToLaunchOrLaunchedOrWillLaunch,
    anUnreleasedOrAnEndOfLife,
  } as ViewGpuContentParams as ContentParams;
}

function getCompatibilityParams(gpu: GpuProduct) {
  const slots = productFieldRawValue(gpu.fields?.slotWidth);
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

  let outputs = productFieldFormattedValue(gpu.fields?.outputs);
  if (outputs === 'No outputs') {
    outputs = 'no';
  } else if (outputs === 'Portable Device Dependent') {
    outputs = null;
  }

  return {
    dimensions: formatGpuDimensions(gpu, {
      allowMissingDimensions: false,
    }),
    height: hasProductFieldRawValue(gpu.fields?.height)
      ? productFieldFormattedValue(gpu.fields?.height)
      : null,
    slotWidth: hasProductFieldRawValue
      ? `${productFieldRawValue(gpu.fields?.slotWidth)}`
      : null,
    slotOrSlots: slots === 1 ? 'slot' : 'slots',
    outputs,
    thickness,
  } as ViewGpuContentParams as ContentParams;
}

function getPowerSupplyParams(gpu: GpuProduct) {
  return {
    psu: hasProductFieldRawValue(gpu.fields?.suggestedPsu)
      ? productFieldFormattedValue(gpu.fields?.suggestedPsu)
      : null,
    tdp: hasProductFieldRawValue(gpu.fields?.tdp)
      ? productFieldFormattedValue(gpu.fields?.tdp)
      : null,
  } as ViewGpuContentParams as ContentParams;
}

function getMemoryParams(gpu: GpuProduct) {
  return {
    memorySize: hasProductFieldRawValue(gpu.fields?.memorySize)
      ? productFieldFormattedValue(gpu.fields?.memorySize)
      : null,
    memoryType: hasProductFieldRawValue(gpu.fields?.memoryType)
      ? productFieldFormattedValue(gpu.fields?.memoryType)
      : null,
    memoryClock: hasProductFieldRawValue(gpu.fields?.memoryClock)
      ? productFieldFormattedValue(gpu.fields?.memoryClock)
      : null,
    memoryInterface: hasProductFieldRawValue(gpu.fields?.memoryInterface)
      ? productFieldFormattedValue(gpu.fields?.memoryInterface)
      : null,
    memoryBandwidth: hasProductFieldRawValue(gpu.fields?.memoryBandwidth)
      ? productFieldFormattedValue(gpu.fields?.memoryBandwidth)
      : null,
  } as ViewGpuContentParams as ContentParams;
}

function getPerformanceParams(
  gpu: GpuProduct,
  additionalData: ViewGpuAdditionalData,
) {
  const chipset = gpu.parent || gpu;

  const bestPerformanceSegmentGpu = additionalData.bestPerformanceGpuForSegment;
  const bestPerformanceDifference = (
    100 *
    (productFieldRawValue(chipset?.fields?.performanceRating) /
      productFieldRawValue(
        bestPerformanceSegmentGpu?.fields?.performanceRating,
      ))
  ).toFixed(2);

  const performanceRating = productFieldFormattedValue(
    chipset.fields?.performanceRating,
  );
  const performanceRank =
    gpu.ranks?.performanceRating > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRating)
      : '';
  const bestPerformanceSegmentGpuName = formatProductName(
    bestPerformanceSegmentGpu,
  );
  const bestPerformanceSegmentGpuShortName = formatProductName(
    bestPerformanceSegmentGpu,
    { company: false },
  );
  const performanceRankForArchitectureSegment =
    gpu.ranks?.performanceRatingForArchitectureAndMarketSegment != null
      ? gpu.ranks.performanceRatingForArchitectureAndMarketSegment > 1
        ? formatOrdinalNumber(
            gpu.ranks.performanceRatingForArchitectureAndMarketSegment,
          )
        : ''
      : null;
  const bestPerformanceSegmentGpuPath =
    bestPerformanceSegmentGpu != null
      ? getViewGpuPath(bestPerformanceSegmentGpu)
      : null;
  const performanceRankForSegment =
    gpu.ranks?.performanceRatingForMarketSegment != null
      ? gpu.ranks.performanceRatingForMarketSegment > 1
        ? formatOrdinalNumber(gpu.ranks.performanceRatingForMarketSegment)
        : ''
      : null;
  const totalPerformanceGpus = String(additionalData.totalPerformanceGpus);

  return {
    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceSegmentGpuName,
    bestPerformanceSegmentGpuShortName,
    bestPerformanceSegmentGpuPath,
    performanceRankForArchitectureSegment,
    performanceRankForSegment,
    totalPerformanceGpus,
  } as ViewGpuContentParams as ContentParams;
}

function getValueParams(gpu: GpuProduct) {
  const chipset = getGpuChipset(gpu);
  const valueRating = hasProductFieldRawValue(
    chipset.fields?.performancePerMsrp,
  )
    ? productFieldFormattedValue(chipset.fields?.performancePerMsrp)
    : null;
  const valueRank =
    gpu.ranks?.performancePerMsrp > 1
      ? formatOrdinalNumber(gpu.ranks?.performancePerMsrp)
      : '';
  const valueRankForSegment =
    gpu.ranks?.performancePerMsrpForMarketSegment > 1
      ? formatOrdinalNumber(gpu.ranks?.performancePerMsrpForMarketSegment)
      : '';

  return {
    valueRating,
    valueRank,
    valueRankForSegment,
  } as ViewGpuContentParams as ContentParams;
}
