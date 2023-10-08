import {
  formatCompanyName,
  formatGpuDimensions,
  formatProductName,
  getGpuChipset,
  GpuFieldKey,
  GpuProduct,
  GpuProductComparison,
  hasProductFieldRawValue,
  hasProductFieldValue,
  isPastGpuLaunchDate,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content/types';

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
  slotOrSlots1?: string;
  slotOrSlots2?: string;
  dimensions1?: string;
  dimensions2?: string;

  tdp1?: string;
  tdp2?: string;
  higherPsuGpuName?: string;
  psu1?: string;
  psu2?: string;
}

export function getContentParams(comparison: GpuProductComparison) {
  return {
    ...getGeneralParams(comparison),
    ...getPerformanceParams(comparison),
    ...getMemoryParams(comparison),
    ...getCompatibilityParams(comparison),
    ...getPowerSupplyParams(comparison),
  } as CompareGpusContentParams as ContentParams;
}

function getGeneralParams(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1NewerOrOlder: string;
  if (
    hasProductFieldRawValue(gpu1.fields?.releaseDate) &&
    hasProductFieldRawValue(gpu2.fields?.releaseDate)
  ) {
    if (
      productFieldRawValue(gpu1.fields?.releaseDate) >
      productFieldRawValue(gpu2.fields?.releaseDate)
    ) {
      gpu1NewerOrOlder = 'newer';
    } else if (
      productFieldRawValue(gpu1.fields?.releaseDate) <
      productFieldRawValue(gpu2.fields?.releaseDate)
    ) {
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
    hasProductFieldValue(gpu1.fields?.msrp) &&
    hasProductFieldRawValue(gpu2.fields?.msrp)
  ) {
    if (
      productFieldRawValue(gpu1.fields?.msrp) >
      productFieldRawValue(gpu2.fields?.msrp)
    ) {
      gpu1LaunchPriceHigherOrLower = 'higher';
    } else if (
      productFieldRawValue(gpu1.fields?.msrp) <
      productFieldRawValue(gpu2.fields?.msrp)
    ) {
      gpu1LaunchPriceHigherOrLower = 'lower';
    }
  }

  return {
    company1: formatCompanyName(gpu1.company),
    company2: formatCompanyName(gpu2.company),
    gpuName1: formatProductName(gpu1),
    gpuName2: formatProductName(gpu2),
    shortGpuName1: formatProductName(gpu1, { company: false }),
    shortGpuName2: formatProductName(gpu2, { company: false }),
    shortestGpuName1: formatProductName(gpu1, {
      company: false,
      brand: false,
    }),
    shortestGpuName2: formatProductName(gpu2, {
      company: false,
      brand: false,
    }),
    chipsetName1: formatProductName(getGpuChipset(gpu1)),
    chipsetName2: formatProductName(getGpuChipset(gpu2)),
    chipsetShortName1: formatProductName(getGpuChipset(gpu1), {
      company: false,
    }),
    chipsetShortName2: formatProductName(getGpuChipset(gpu2), {
      company: false,
    }),
    marketSegment1: hasProductFieldRawValue(gpu1.fields?.marketSegment)
      ? productFieldFormattedValue(gpu1.fields?.marketSegment)?.toLowerCase()
      : null,
    marketSegment2: hasProductFieldRawValue(gpu2.fields?.marketSegment)
      ? productFieldFormattedValue(gpu2.fields?.marketSegment)?.toLowerCase()
      : null,
    gpu1NewerOrOlder,
    gpu2WillReleaseOrWasReleased,
    releaseDate1: hasProductFieldRawValue(gpu1.fields?.releaseDate)
      ? productFieldFormattedValue(gpu1.fields?.releaseDate)
      : null,
    releaseDate2: hasProductFieldRawValue(gpu2.fields?.releaseDate)
      ? productFieldFormattedValue(gpu2.fields?.releaseDate)
      : null,
    gpu1LaunchPriceHigherOrLower,
    launchPrice1: hasProductFieldRawValue(gpu1.fields?.msrp)
      ? productFieldFormattedValue(gpu1.fields?.msrp)
      : null,
    launchPrice2: hasProductFieldRawValue(gpu2.fields?.msrp)
      ? productFieldFormattedValue(gpu2.fields?.msrp)
      : null,
  } as CompareGpusContentParams as ContentParams;
}

function getPerformanceParams(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

  let gpu1PerformanceMoreOrLess: string;
  let gpu1PerformanceHigherOrLower: string;
  let gpu1PerformanceDifferencePct: string;
  if (
    hasProductFieldRawValue(chipset1.fields?.performanceRating) &&
    hasProductFieldRawValue(chipset2.fields?.performanceRating)
  ) {
    const performanceScore1 = productFieldRawValue(
      chipset1.fields?.performanceRating,
    );
    const performanceScore2 = productFieldRawValue(
      chipset2.fields?.performanceRating,
    );
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
    hasProductFieldRawValue(chipset1.fields?.performancePerMsrp) &&
    hasProductFieldRawValue(chipset2.fields?.performancePerMsrp)
  ) {
    const valueScore1 = productFieldRawValue(
      chipset1.fields?.performancePerMsrp,
    );
    const valueScore2 = productFieldRawValue(
      chipset2.fields?.performancePerMsrp,
    );
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
    performancePerDollar1: hasProductFieldRawValue(
      chipset1.fields?.performancePerMsrp,
    )
      ? productFieldFormattedValue(chipset1.fields?.performancePerMsrp)
      : null,
    performancePerDollar2: hasProductFieldRawValue(
      chipset2.fields?.performancePerMsrp,
    )
      ? productFieldFormattedValue(chipset2.fields?.performancePerMsrp)
      : null,
  } as CompareGpusContentParams as ContentParams;
}

function getMemoryParams(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1MemorySizeMoreOrLess: string;
  if (
    hasProductFieldRawValue(gpu1.fields?.memorySize) &&
    hasProductFieldRawValue(gpu2.fields?.memorySize)
  ) {
    if (
      productFieldRawValue(gpu1.fields?.memorySize) >
      productFieldRawValue(gpu2.fields?.memorySize)
    ) {
      gpu1MemorySizeMoreOrLess = 'more';
    } else if (
      productFieldRawValue(gpu1.fields?.memorySize) <
      productFieldRawValue(gpu2.fields?.memorySize)
    ) {
      gpu1MemorySizeMoreOrLess = 'less';
    }
  }

  let gpu1MemoryBandwidthFasterOrSlower: string;
  if (
    hasProductFieldRawValue(gpu1.fields?.memoryBandwidth) &&
    hasProductFieldRawValue(gpu2.fields?.memoryBandwidth)
  ) {
    if (
      productFieldRawValue(gpu1.fields?.memoryBandwidth) >
      productFieldRawValue(gpu2.fields?.memoryBandwidth)
    ) {
      gpu1MemoryBandwidthFasterOrSlower = 'faster';
    } else if (
      productFieldRawValue(gpu1.fields?.memoryBandwidth) <
      productFieldRawValue(gpu2.fields?.memoryBandwidth)
    ) {
      gpu1MemoryBandwidthFasterOrSlower = 'slower';
    }
  }

  return {
    gpu1MemorySizeMoreOrLess,
    gpu1MemoryBandwidthFasterOrSlower,
    memorySize1: hasProductFieldRawValue(gpu1.fields?.memorySize)
      ? productFieldFormattedValue(gpu1.fields?.memorySize)
      : null,
    memorySize2: hasProductFieldRawValue(gpu2.fields?.memorySize)
      ? productFieldFormattedValue(gpu2.fields?.memorySize)
      : null,
    memoryType1: hasProductFieldRawValue(gpu1.fields?.memoryType)
      ? productFieldFormattedValue(gpu1.fields?.memoryType)
      : null,
    memoryType2: hasProductFieldRawValue(gpu2.fields?.memoryType)
      ? productFieldFormattedValue(gpu2.fields?.memoryType)
      : null,
    memoryBandwidth1: hasProductFieldRawValue(gpu1.fields?.memoryBandwidth)
      ? productFieldFormattedValue(gpu1.fields?.memoryBandwidth)
      : null,
    memoryBandwidth2: hasProductFieldRawValue(gpu2.fields?.memoryBandwidth)
      ? productFieldFormattedValue(gpu2.fields?.memoryBandwidth)
      : null,
  } as CompareGpusContentParams as ContentParams;
}

function getCompatibilityParams(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;

  let gpu1ThickerOrThinner: string;
  if (
    hasProductFieldRawValue(gpu1.fields?.slotWidth) &&
    hasProductFieldRawValue(gpu2.fields?.slotWidth)
  ) {
    if (
      productFieldRawValue(gpu1.fields?.slotWidth) >
      productFieldRawValue(gpu2.fields?.slotWidth)
    ) {
      gpu1ThickerOrThinner = 'thicker';
    } else if (
      productFieldRawValue(gpu1.fields?.slotWidth) <
      productFieldRawValue(gpu2.fields?.slotWidth)
    ) {
      gpu1ThickerOrThinner = 'thinner';
    }
  }

  return {
    gpu1ThickerOrThinner,
    slotWidth1: hasProductFieldRawValue(gpu1.fields?.slotWidth)
      ? `${productFieldRawValue(gpu1.fields?.slotWidth)}`
      : null,
    slotWidth2: hasProductFieldRawValue(gpu2.fields?.slotWidth)
      ? `${productFieldRawValue(gpu2.fields?.slotWidth)}`
      : null,
    slotOrSlots1:
      productFieldRawValue(gpu1.fields?.slotWidth) === 1 ? 'slot' : 'slots',
    slotOrSlots2:
      productFieldRawValue(gpu2.fields?.slotWidth) === 1 ? 'slot' : 'slots',
    dimensions1: formatGpuDimensions(gpu1, {
      allowMissingDimensions: false,
    }),
    dimensions2: formatGpuDimensions(gpu2, {
      allowMissingDimensions: false,
    }),
    outputs1: hasProductFieldRawValue(gpu1.fields?.outputs)
      ? productFieldFormattedValue(gpu1.fields?.outputs)
      : null,
    outputs2: hasProductFieldRawValue(gpu2.fields?.outputs)
      ? productFieldFormattedValue(gpu2.fields?.outputs)
      : null,
  } as CompareGpusContentParams as ContentParams;
}

function getPowerSupplyParams(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;

  const [higherPsuGpu] = getGreaterAndLesserGpuFromField(
    gpu1,
    gpu2,
    'suggestedPsu',
  );

  return {
    tdp1: hasProductFieldRawValue(gpu1.fields?.tdp)
      ? productFieldFormattedValue(gpu1.fields?.tdp)
      : null,
    tdp2: hasProductFieldRawValue(gpu2.fields?.tdp)
      ? productFieldFormattedValue(gpu2.fields?.tdp)
      : null,
    higherPsuGpuName: formatProductName(higherPsuGpu, {
      company: false,
      brand: false,
    }),
    psu1: hasProductFieldRawValue(gpu1.fields?.suggestedPsu)
      ? productFieldFormattedValue(gpu1.fields?.suggestedPsu)
      : null,
    psu2: hasProductFieldRawValue(gpu2.fields?.suggestedPsu)
      ? productFieldFormattedValue(gpu2.fields?.suggestedPsu)
      : null,
  } as CompareGpusContentParams as ContentParams;
}

export function getGreaterAndLesserGpuFromField(
  gpu1: GpuProduct,
  gpu2: GpuProduct,
  fieldKey: GpuFieldKey,
) {
  const field1 = gpu1?.fields?.[fieldKey];
  const field2 = gpu2?.fields?.[fieldKey];
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
