import { Gpu, GpuComparison, GpuFieldKey } from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';
import { DateFormatter } from 'packages/website/src/client/shared/format';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
  getShoppingUrl,
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
  marketSegment1?: string;
  marketSegment2?: string;
  releaseDate1?: string;
  releaseDate2?: string;
  shoppingUrl1?: string;
  shoppingUrl2?: string;
  year1?: string;
  year2?: string;
  newerShortGpuName?: string;
  olderShortGpuName?: string;
  newerReleaseDate?: string;
  olderReleaseDate?: string;
  fasterShortGpuName?: string;
  slowerShortGpuName?: string;
  fasterPerformanceFactor?: string;
  higherValueShortGpuName?: string;
  lowerValueShortGpuName?: string;
  betterValueFactor?: string;

  gpu1MemorySizeMoreOrLess?: string;
  gpu1MemoryBandwidthFasterOrSlower?: string;
  memorySize1?: string;
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
  higherPsuGpuName?: string;
  psu1?: string;
  psu2?: string;
}

export function getContentParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  const shoppingUrl1 = getShoppingUrl(gpu1);
  const shoppingUrl2 = getShoppingUrl(gpu2);
  const year1 = formatGpuField(gpu1.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });
  const year2 = formatGpuField(gpu2.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });

  let newerShortGpuName: string,
    olderShortGpuName: string,
    newerReleaseDate: string,
    olderReleaseDate: string;
  // Can only have newer and older gpus if both have different release dates.
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    const releaseDateCmp = gpu1.releaseDate.value.localeCompare(
      gpu2.releaseDate.value,
    );
    if (releaseDateCmp < 0) {
      olderShortGpuName = getGpuName(gpu1, { company: false });
      olderReleaseDate = formatGpuField(gpu1.releaseDate);
      newerShortGpuName = getGpuName(gpu2, { company: false });
      newerReleaseDate = formatGpuField(gpu2.releaseDate);
    } else if (releaseDateCmp > 0) {
      newerShortGpuName = getGpuName(gpu1, { company: false });
      newerReleaseDate = formatGpuField(gpu1.releaseDate);
      olderShortGpuName = getGpuName(gpu2, { company: false });
      olderReleaseDate = formatGpuField(gpu2.releaseDate);
    }
  }

  let fasterShortGpuName: string,
    slowerShortGpuName: string,
    fasterPerformanceFactor: string;
  if (
    gpu1.performanceScore?.value != null &&
    gpu2.performanceScore?.value != null
  ) {
    const performanceScore1 = gpu1.performanceScore?.value;
    const performanceScore2 = gpu2.performanceScore?.value;
    if (performanceScore1 > performanceScore2) {
      fasterShortGpuName = getGpuName(gpu1, { company: false });
      slowerShortGpuName = getGpuName(gpu2, { company: false });
      fasterPerformanceFactor =
        ((performanceScore1 / performanceScore2 - 1) * 100).toFixed(2) + '%';
    } else if (performanceScore1 < performanceScore2) {
      slowerShortGpuName = getGpuName(gpu1, { company: false });
      fasterShortGpuName = getGpuName(gpu2, { company: false });
      fasterPerformanceFactor =
        ((performanceScore2 / performanceScore1 - 1) * 100).toFixed(2) + '%';
    }
  }

  let higherValueShortGpuName: string,
    lowerValueShortGpuName: string,
    betterValueFactor: string;
  if (gpu1.valueScore?.value != null && gpu2.valueScore?.value != null) {
    const valueScore1 = gpu1.valueScore?.value;
    const valueScore2 = gpu2.valueScore?.value;
    if (valueScore1 > valueScore2) {
      higherValueShortGpuName = getGpuName(gpu1, { company: false });
      lowerValueShortGpuName = getGpuName(gpu2, { company: false });
      betterValueFactor =
        ((valueScore1 / valueScore2 - 1) * 100).toFixed(2) + '%';
    } else if (valueScore1 < valueScore2) {
      lowerValueShortGpuName = getGpuName(gpu1, { company: false });
      higherValueShortGpuName = getGpuName(gpu2, { company: false });
      betterValueFactor =
        ((valueScore2 / valueScore1 - 1) * 100).toFixed(2) + '%';
    }
  }

  return {
    shoppingUrl1,
    shoppingUrl2,
    year1,
    year2,
    newerShortGpuName,
    olderShortGpuName,
    newerReleaseDate,
    olderReleaseDate,
    fasterShortGpuName,
    slowerShortGpuName,
    fasterPerformanceFactor,
    higherValueShortGpuName,
    lowerValueShortGpuName,
    betterValueFactor,
    ...getGeneralParams(comparison),
    ...getMemoryParams(comparison),
    ...getCompatibilityParams(comparison),
    ...getPowerSupplyParams(comparison),
  } as CompareGpusContentParams as ContentParams;
}

function getGeneralParams(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  return {
    company1: formatGpuField(gpu1.company),
    company2: formatGpuField(gpu2.company),
    gpuName1: getGpuName(gpu1),
    gpuName2: getGpuName(gpu2),
    shortGpuName1: getGpuName(gpu1, { company: false }),
    shortGpuName2: getGpuName(gpu2, { company: false }),
    shortestGpuName1: getGpuName(gpu1, { company: false, brand: false }),
    shortestGpuName2: getGpuName(gpu2, { company: false, brand: false }),
    marketSegment1: formatGpuField(gpu1.marketSegment)?.toLowerCase(),
    marketSegment2: formatGpuField(gpu2.marketSegment)?.toLowerCase(),
    releaseDate1: formatGpuField(gpu1.releaseDate),
    releaseDate2: formatGpuField(gpu2.releaseDate),
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
