import { getChipset, Gpu, GpuComparison, GpuFieldKey } from '@pcpartdb/shared';
import { format } from 'date-fns';
import { ContentParams } from 'packages/website/src/client/shared/content';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '../../../utils';

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
  gpu1WillReleaseOrWereReleased?: string;
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
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    if (gpu1.releaseDate?.value > gpu2.releaseDate?.value) {
      gpu1NewerOrOlder = 'newer';
    } else if (gpu1.releaseDate?.value < gpu2.releaseDate?.value) {
      gpu1NewerOrOlder = 'older';
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  let gpu1WillReleaseOrWereReleased: string;
  if (gpu1.releaseDate?.value != null) {
    if (gpu1.releaseDate?.value > today) {
      gpu1WillReleaseOrWereReleased = 'will release';
    } else {
      gpu1WillReleaseOrWereReleased = 'were released';
    }
  }

  let gpu2WillReleaseOrWasReleased: string;
  if (gpu2.releaseDate?.value != null) {
    if (gpu2.releaseDate?.value > today) {
      gpu2WillReleaseOrWasReleased = 'will release';
    } else {
      gpu2WillReleaseOrWasReleased = 'was released';
    }
  }

  let gpu1LaunchPriceHigherOrLower: string;
  if (gpu1.launchPrice?.value != null && gpu2.launchPrice?.value != null) {
    if (gpu1.launchPrice?.value > gpu2.launchPrice?.value) {
      gpu1LaunchPriceHigherOrLower = 'higher';
    } else if (gpu1.launchPrice?.value < gpu2.launchPrice?.value) {
      gpu1LaunchPriceHigherOrLower = 'lower';
    }
  }

  return {
    company1: formatGpuField(gpu1.company),
    company2: formatGpuField(gpu2.company),
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
    shortGpuName1: getGpuName(gpu1, { company: false }),
    shortGpuName2: getGpuName(gpu2, { company: false }),
    shortestGpuName1: getGpuName(gpu1, { company: false, brand: false }),
    shortestGpuName2: getGpuName(gpu2, { company: false, brand: false }),
    chipsetName1: getGpuName(getChipset(gpu1)),
    chipsetName2: getGpuName(getChipset(gpu2)),
    chipsetShortName1: getGpuName(getChipset(gpu1), { company: false }),
    chipsetShortName2: getGpuName(getChipset(gpu2), { company: false }),
    marketSegment1: formatGpuField(gpu1.marketSegment)?.toLowerCase(),
    marketSegment2: formatGpuField(gpu2.marketSegment)?.toLowerCase(),
    gpu1NewerOrOlder,
    gpu1WillReleaseOrWereReleased,
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
  const chipset1 = getChipset(gpu1);
  const chipset2 = getChipset(gpu2);

  let gpu1PerformanceMoreOrLess: string;
  let gpu1PerformanceHigherOrLower: string;
  let gpu1PerformanceDifferencePct: string;
  if (
    chipset1.performanceScore?.value != null &&
    chipset2.performanceScore?.value != null
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
    chipset1.valueScore?.value != null &&
    chipset2.valueScore?.value != null
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
  if (gpu1.memorySize?.value != null && gpu2.memorySize?.value != null) {
    if (gpu1.memorySize?.value > gpu2.memorySize?.value) {
      gpu1MemorySizeMoreOrLess = 'more';
    } else if (gpu1.memorySize?.value < gpu2.memorySize?.value) {
      gpu1MemorySizeMoreOrLess = 'less';
    }
  }

  let gpu1MemoryBandwidthFasterOrSlower: string;
  if (
    gpu1.memoryBandwidth?.value != null &&
    gpu2.memoryBandwidth?.value != null
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
  if (gpu1.slotWidth?.value != null && gpu2.slotWidth?.value != null) {
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
    higherPsuGpuName: getGpuName(higherPsuGpu, {
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
