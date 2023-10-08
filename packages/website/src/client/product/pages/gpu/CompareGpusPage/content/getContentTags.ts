import {
  formatCompanyName,
  getGpuChipset,
  GpuField,
  GpuProductComparison,
  hasProductFieldRawValue,
  MarketSegment,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';

export enum CompareGpusContentTag {
  DifferentCompany = 'DIFFERENT_COMPANY',
  SameCompany = 'SAME_COMPANY',
  DifferentMarketSegment = 'DIFFERENT_MARKET_SEGMENT',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  DifferentReleaseDate = 'DIFFERENT_RELEASE_DATE',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  DifferentLaunchPrice = 'DIFFERENT_LAUNCH_PRICE',
  SameLaunchPrice = 'SAME_LAUNCH_PRICE',

  DifferentPerformance = 'DIFFERENT_PERFORMANCE',
  SamePerformance = 'SAME_PERFORMANCE',
  DifferentPerformancePerDollar = 'DIFFERENT_PERFORMANCE_PER_DOLLAR',
  SamePerformancePerDollar = 'SAME_PERFORMANCE_PER_DOLLAR',

  SameMemorySize = 'SAME_MEMORY_SIZE',
  SameMemoryType = 'SAME_MEMORY_TYPE',
  SameMemoryBandwidth = 'SAME_MEMORY_BANDWIDTH',
  DifferentMemorySize = 'DIFFERENT_MEMORY_SIZE',
  DifferentMemoryBandwidth = 'DIFFERENT_MEMORY_BANDWIDTH',

  DifferentSlotWidth = 'DIFFERENT_SLOT_WIDTH',
  SameSlotWidth = 'SAME_SLOT_WIDTH',
  DifferentOutputs = 'DIFFERENT_OUTPUTS',
  SameOutputs = 'SAME_OUTPUTS',

  DifferentTdp = 'DIFFERENT_TDP',
  SameTdp = 'SAME_TDP',
  DifferentPsu = 'DIFFERENT_PSU',
  SamePsu = 'SAME_PSU',
}

export function getContentTags(comparison: GpuProductComparison) {
  return {
    ...getGeneralTags(comparison),
    ...getPerformanceTags(comparison),
    ...getMemoryTags(comparison),
    ...getCompatibilityTags(comparison),
    ...getPowerSupplyTags(comparison),
  };
}

function getGeneralTags(comparison: GpuProductComparison) {
  return {
    [CompareGpusContentTag.DifferentCompany]: hasDifferentCompany(comparison),
    [CompareGpusContentTag.SameCompany]: hasSameCompany(comparison),
    [CompareGpusContentTag.DifferentMarketSegment]:
      hasDifferentMarketSegment(comparison),
    [CompareGpusContentTag.SameMarketSegment]: hasSameMarketSegment(comparison),
    [CompareGpusContentTag.DifferentReleaseDate]:
      hasDifferentReleaseDate(comparison),
    [CompareGpusContentTag.SameReleaseDate]: hasSameReleaseDate(comparison),
    [CompareGpusContentTag.DifferentLaunchPrice]:
      hasDifferentLaunchPrice(comparison),
    [CompareGpusContentTag.SameLaunchPrice]: hasSameLaunchPrice(comparison),
  };
}

function getPerformanceTags(comparison: GpuProductComparison) {
  return {
    [CompareGpusContentTag.DifferentPerformance]:
      hasDifferentPerformance(comparison),
    [CompareGpusContentTag.SamePerformance]: hasSamePerformance(comparison),
    [CompareGpusContentTag.DifferentPerformancePerDollar]:
      hasDifferentPerformancePerDollar(comparison),
    [CompareGpusContentTag.SamePerformancePerDollar]:
      hasSamePerformancePerDollar(comparison),
  };
}

function getMemoryTags(comparison: GpuProductComparison) {
  return {
    [CompareGpusContentTag.SameMemorySize]: hasSameMemorySize(comparison),
    [CompareGpusContentTag.SameMemoryType]: hasSameMemoryType(comparison),
    [CompareGpusContentTag.SameMemoryBandwidth]:
      hasSameMemoryBandwidth(comparison),
    [CompareGpusContentTag.DifferentMemoryBandwidth]:
      hasDifferentMemoryBandwidth(comparison),
    [CompareGpusContentTag.DifferentMemorySize]:
      hasDifferentMemorySize(comparison),
  };
}

function getCompatibilityTags(comparison: GpuProductComparison) {
  return {
    [CompareGpusContentTag.DifferentSlotWidth]:
      hasDifferentSlotWidth(comparison),
    [CompareGpusContentTag.SameSlotWidth]: hasSameSlotWidth(comparison),
    [CompareGpusContentTag.DifferentOutputs]: hasDifferentOutputs(comparison),
    [CompareGpusContentTag.SameOutputs]: hasSameOutputs(comparison),
  };
}

function getPowerSupplyTags(comparison: GpuProductComparison) {
  return {
    [CompareGpusContentTag.DifferentTdp]: hasDifferentTdp(comparison),
    [CompareGpusContentTag.SameTdp]: hasSameTdp(comparison),
    [CompareGpusContentTag.DifferentPsu]: hasDifferentPsu(comparison),
    [CompareGpusContentTag.SamePsu]: hasSamePsu(comparison),
  };
}

function hasDifferentCompany(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return formatCompanyName(gpu1.company) !== formatCompanyName(gpu2.company);
}

function hasSameCompany(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return formatCompanyName(gpu1.company) === formatCompanyName(gpu2.company);
}

function hasDifferentMarketSegment(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    gpu1.fields?.marketSegment,
    gpu2.fields?.marketSegment,
  );
}

function hasSameMarketSegment(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.marketSegment, gpu2.fields?.marketSegment);
}

function hasDifferentReleaseDate(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.fields?.releaseDate == null || gpu2.fields?.releaseDate == null) {
    return false;
  }

  return (
    productFieldFormattedValue(gpu1.fields?.releaseDate) !==
    productFieldFormattedValue(gpu2.fields?.releaseDate)
  );
}

function hasSameReleaseDate(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.fields?.releaseDate == null || gpu2.fields?.releaseDate == null) {
    return false;
  }

  return (
    productFieldFormattedValue(gpu1.fields?.releaseDate) ===
    productFieldFormattedValue(gpu2.fields?.releaseDate)
  );
}

function hasDifferentLaunchPrice(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.fields?.msrp, gpu2.fields?.msrp);
}

function hasSameLaunchPrice(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.msrp, gpu2.fields?.msrp);
}

function hasDifferentPerformance(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    getGpuChipset(gpu1).fields?.performanceRating,
    getGpuChipset(gpu2).fields?.performanceRating,
  );
}

function hasSamePerformance(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(
    getGpuChipset(gpu1).fields?.performanceRating,
    getGpuChipset(gpu2).fields?.performanceRating,
  );
}

function hasDifferentPerformancePerDollar(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    getGpuChipset(gpu1).fields?.performancePerMsrp,
    getGpuChipset(gpu2).fields?.performancePerMsrp,
  );
}

function hasSamePerformancePerDollar(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(
    getGpuChipset(gpu1).fields?.performancePerMsrp,
    getGpuChipset(gpu2).fields?.performancePerMsrp,
  );
}

function hasDifferentMemorySize(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.fields?.memorySize, gpu2.fields?.memorySize);
}

function hasSameMemorySize(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.memorySize, gpu2.fields?.memorySize);
}

function hasSameMemoryType(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.memoryType, gpu2.fields?.memoryType);
}

function hasDifferentMemoryBandwidth(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    gpu1.fields?.memoryBandwidth,
    gpu2.fields?.memoryBandwidth,
  );
}

function hasSameMemoryBandwidth(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(
    gpu1.fields?.memoryBandwidth,
    gpu2.fields?.memoryBandwidth,
  );
}

function hasDifferentSlotWidth(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.fields?.slotWidth, gpu2.fields?.slotWidth);
}

function hasSameSlotWidth(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.slotWidth, gpu2.fields?.slotWidth);
}

function hasDifferentOutputs(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  if (
    productFieldRawValue(gpu1.fields?.marketSegment) === MarketSegment.Mobile ||
    productFieldRawValue(gpu2.fields?.marketSegment) === MarketSegment.Mobile ||
    productFieldRawValue(gpu1.fields?.marketSegment) ===
      MarketSegment.Integrated ||
    productFieldRawValue(gpu2.fields?.marketSegment) ===
      MarketSegment.Integrated
  ) {
    // Mobile and Integrated GPUs don't have outputs.
    return false;
  }
  return hasDifferentValue(gpu1.fields?.outputs, gpu2.fields?.outputs);
}

function hasSameOutputs(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  if (
    productFieldRawValue(gpu1.fields?.marketSegment) === MarketSegment.Mobile ||
    productFieldRawValue(gpu2.fields?.marketSegment) === MarketSegment.Mobile ||
    productFieldRawValue(gpu1.fields?.marketSegment) ===
      MarketSegment.Integrated ||
    productFieldRawValue(gpu2.fields?.marketSegment) ===
      MarketSegment.Integrated
  ) {
    // Mobile and Integrated GPUs don't have outputs.
    return false;
  }
  return hasSameValue(gpu1.fields?.outputs, gpu2.fields?.outputs);
}

function hasDifferentTdp(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.fields?.tdp, gpu2.fields?.tdp);
}

function hasSameTdp(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.tdp, gpu2.fields?.tdp);
}

function hasDifferentPsu(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    gpu1.fields?.suggestedPsu,
    gpu2.fields?.suggestedPsu,
  );
}

function hasSamePsu(comparison: GpuProductComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.fields?.suggestedPsu, gpu2.fields?.suggestedPsu);
}

function hasDifferentValue(field1?: GpuField, field2?: GpuField) {
  if (!hasProductFieldRawValue(field1) || !hasProductFieldRawValue(field2)) {
    return false;
  }

  return field1.value !== field2.value;
}

function hasSameValue(field1?: GpuField, field2?: GpuField) {
  if (!hasProductFieldRawValue(field1) || !hasProductFieldRawValue(field2)) {
    return false;
  }

  return field1.value === field2.value;
}
