import {
  formatGpuDimensions,
  formatGpuField,
  formatGpuName,
  getGpuChipset,
  Gpu,
  GpuComparison,
  GpuFieldKey,
  hasProductFieldValue,
  isPastGpuLaunchDate,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';

export interface CompareGpusContentParams {
  company1?: string;
  company2?: string;
  gpuName1?: string;
  gpuName2?: string;
  shortGpuName1?: string;
  shortGpuName2?: string;
  shortestGpuName1?: string;
  shortestGpuName2?: string;
  chipsetName1?: string;
  chipsetName2?: string;
  chipsetShortName1?: string;
  chipsetShortName2?: string;
  marketSegment1?: string;
  marketSegment2?: string;
  gpu1NewerOrOlder?: string;
  gpu2WillReleaseOrWasReleased?: string;
  releaseDate1?: string;
  releaseDate2?: string;
  gpu1LaunchPriceHigherOrLower?: string;
  launchPrice1?: string;
  launchPrice2?: string;

  gpu1PerformanceMoreOrLess?: string;
  gpu1PerformanceHigherOrLower?: string;
  gpu1PerformanceDifferencePct?: string;
  gpu1ValueHigherOrLower?: string;
  performancePerDollar1?: string;
  performancePerDollar2?: string;

  gpu1MemorySizeMoreOrLess?: string;
  gpu1MemoryBandwidthFasterOrSlower?: string;
  memorySize1?: string;
  memorySize2?: string;
  memoryType1?: string;
  memoryType2?: string;
  memoryBandwidth1?: string;
  memoryBandwidth2?: string;

  gpu1ThickerOrThinner?: string;
  slotWidth1?: string;
  slotWidth2?: string;
  dimensions1?: string;
  dimensions2?: string;

  tdp1?: string;
  tdp2?: string;
  higherPsuGpuName?: string;
  psu1?: string;
  psu2?: string;
}

export function getContentParams(comparison: GpuComparison) {
  return {
    ...getGeneralParams(comparison),
    ...getPerformanceParams(comparison),
    ...getMemoryParams(comparison),
    ...getCompatibilityParams(comparison),
    ...getPowerSupplyParams(comparison),
  } as CompareGpusContentParams as ContentParams;
}

function getGeneralParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1NewerOrOlder: string;
  if (
    hasProductFieldValue(gpu1.releaseDate) &&
    hasProductFieldValue(gpu2.releaseDate)
  ) {
    if (gpu1.releaseDate?.value > gpu2.releaseDate?.value) {
      gpu1NewerOrOlder = 'newer';
    } else if (gpu1.releaseDate?.value < gpu2.releaseDate?.value) {
      gpu1NewerOrOlder = 'older';
    }
  }

  let gpu2WillReleaseOrWasReleased: string;
  if (isPastGpuLaunchDate(gpu2)) {
    gpu2WillReleaseOrWasReleased = 'was released';
  } else {
    gpu2WillReleaseOrWasReleased = 'will release';
  }

  let gpu1LaunchPriceHigherOrLower: string;
  if (
    hasProductFieldValue(gpu1.launchPrice) &&
    hasProductFieldValue(gpu2.launchPrice)
  ) {
    if (gpu1.launchPrice?.value > gpu2.launchPrice?.value) {
      gpu1LaunchPriceHigherOrLower = 'higher';
    } else if (gpu1.launchPrice?.value < gpu2.launchPrice?.value) {
      gpu1LaunchPriceHigherOrLower = 'lower';
    }
  }

  return {
    company1: formatGpuField(gpu1.company),
    company2: formatGpuField(gpu2.company),
    gpuName1: formatGpuName(gpu1),
    gpuName2: formatGpuName(gpu2),
    shortGpuName1: formatGpuName(gpu1, { company: false }),
    shortGpuName2: formatGpuName(gpu2, { company: false }),
    shortestGpuName1: formatGpuName(gpu1, { company: false, brand: false }),
    shortestGpuName2: formatGpuName(gpu2, { company: false, brand: false }),
    chipsetName1: formatGpuName(getGpuChipset(gpu1)),
    chipsetName2: formatGpuName(getGpuChipset(gpu2)),
    chipsetShortName1: formatGpuName(getGpuChipset(gpu1), { company: false }),
    chipsetShortName2: formatGpuName(getGpuChipset(gpu2), { company: false }),
    marketSegment1: formatGpuField(gpu1.marketSegment)?.toLowerCase(),
    marketSegment2: formatGpuField(gpu2.marketSegment)?.toLowerCase(),
    gpu1NewerOrOlder,
    gpu2WillReleaseOrWasReleased,
    releaseDate1: formatGpuField(gpu1.releaseDate),
    releaseDate2: formatGpuField(gpu2.releaseDate),
    gpu1LaunchPriceHigherOrLower,
    launchPrice1: formatGpuField(gpu1.launchPrice),
    launchPrice2: formatGpuField(gpu2.launchPrice),
  } as CompareGpusContentParams as ContentParams;
}

function getPerformanceParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

  let gpu1PerformanceMoreOrLess: string;
  let gpu1PerformanceHigherOrLower: string;
  let gpu1PerformanceDifferencePct: string;
  if (
    hasProductFieldValue(chipset1.performanceScore) &&
    hasProductFieldValue(chipset2.performanceScore)
  ) {
    const performanceScore1 = chipset1.performanceScore.value;
    const performanceScore2 = chipset2.performanceScore.value;
    if (performanceScore1 > performanceScore2) {
      gpu1PerformanceMoreOrLess = 'more';
      gpu1PerformanceHigherOrLower = 'higher';
      gpu1PerformanceDifferencePct =
        ((performanceScore1 / performanceScore2 - 1) * 100).toFixed(0) + '%';
    } else if (performanceScore1 < performanceScore2) {
      gpu1PerformanceMoreOrLess = 'less';
      gpu1PerformanceHigherOrLower = 'lower';
      gpu1PerformanceDifferencePct =
        ((1 - performanceScore1 / performanceScore2) * 100).toFixed(0) + '%';
    }
  }

  let gpu1ValueHigherOrLower: string;
  if (
    hasProductFieldValue(chipset1.valueScore) &&
    hasProductFieldValue(chipset2.valueScore)
  ) {
    const valueScore1 = chipset1.valueScore.value;
    const valueScore2 = chipset2.valueScore.value;
    if (valueScore1 > valueScore2) {
      gpu1ValueHigherOrLower = 'higher';
    } else if (valueScore1 < valueScore2) {
      gpu1ValueHigherOrLower = 'lower';
    }
  }

  return {
    gpu1PerformanceMoreOrLess,
    gpu1PerformanceHigherOrLower,
    gpu1PerformanceDifferencePct,
    gpu1ValueHigherOrLower,
    performancePerDollar1: formatGpuField(chipset1.valueScore),
    performancePerDollar2: formatGpuField(chipset2.valueScore),
  } as CompareGpusContentParams as ContentParams;
}

function getMemoryParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1MemorySizeMoreOrLess: string;
  if (
    hasProductFieldValue(gpu1.memorySize) &&
    hasProductFieldValue(gpu2.memorySize)
  ) {
    if (gpu1.memorySize?.value > gpu2.memorySize?.value) {
      gpu1MemorySizeMoreOrLess = 'more';
    } else if (gpu1.memorySize?.value < gpu2.memorySize?.value) {
      gpu1MemorySizeMoreOrLess = 'less';
    }
  }

  let gpu1MemoryBandwidthFasterOrSlower: string;
  if (
    hasProductFieldValue(gpu1.memoryBandwidth) &&
    hasProductFieldValue(gpu2.memoryBandwidth)
  ) {
    if (gpu1.memoryBandwidth?.value > gpu2.memoryBandwidth?.value) {
      gpu1MemoryBandwidthFasterOrSlower = 'faster';
    } else if (gpu1.memoryBandwidth?.value < gpu2.memoryBandwidth?.value) {
      gpu1MemoryBandwidthFasterOrSlower = 'slower';
    }
  }

  return {
    gpu1MemorySizeMoreOrLess,
    gpu1MemoryBandwidthFasterOrSlower,
    memorySize1: formatGpuField(gpu1.memorySize),
    memorySize2: formatGpuField(gpu2.memorySize),
    memoryType1: formatGpuField(gpu1.memoryType),
    memoryType2: formatGpuField(gpu2.memoryType),
    memoryBandwidth1: formatGpuField(gpu1.memoryBandwidth),
    memoryBandwidth2: formatGpuField(gpu2.memoryBandwidth),
  } as CompareGpusContentParams as ContentParams;
}

function getCompatibilityParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1ThickerOrThinner: string;
  if (
    hasProductFieldValue(gpu1.slotWidth) &&
    hasProductFieldValue(gpu2.slotWidth)
  ) {
    if (gpu1.slotWidth?.value > gpu2.slotWidth?.value) {
      gpu1ThickerOrThinner = 'thicker';
    } else if (gpu1.slotWidth?.value < gpu2.slotWidth?.value) {
      gpu1ThickerOrThinner = 'thinner';
    }
  }

  return {
    gpu1ThickerOrThinner,
    slotWidth1: formatGpuField(gpu1.slotWidth, { showUnits: false }),
    slotWidth2: formatGpuField(gpu2.slotWidth, { showUnits: false }),
    dimensions1: formatGpuDimensions(gpu1, { allowMissingDimensions: false }),
    dimensions2: formatGpuDimensions(gpu2, { allowMissingDimensions: false }),
    outputs1: formatGpuField(gpu1.outputs),
    outputs2: formatGpuField(gpu2.outputs),
  } as CompareGpusContentParams as ContentParams;
}

function getPowerSupplyParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  const [higherPsuGpu] = getGreaterAndLesserGpuFromField(
    gpu1,
    gpu2,
    'suggestedPsu',
  );

  return {
    tdp1: formatGpuField(gpu1.thermalDesignPower),
    tdp2: formatGpuField(gpu2.thermalDesignPower),
    higherPsuGpuName: formatGpuName(higherPsuGpu, {
      company: false,
      brand: false,
    }),
    psu1: formatGpuField(gpu1.suggestedPsu),
    psu2: formatGpuField(gpu2.suggestedPsu),
  } as CompareGpusContentParams as ContentParams;
}

export function getGreaterAndLesserGpuFromField(
  gpu1: Gpu,
  gpu2: Gpu,
  fieldKey: GpuFieldKey,
) {
  const field1 = gpu1?.[fieldKey];
  const field2 = gpu2?.[fieldKey];
  if (typeof field1 !== 'object' || typeof field2 !== 'object') {
    return [null, null];
  }

  if (!('value' in field1 && 'value' in field2)) {
    return [null, null];
  }

  if (field1.value === field2.value) {
    return [null, null];
  }

  return field1.value > field2.value ? [gpu1, gpu2] : [gpu2, gpu1];
}
