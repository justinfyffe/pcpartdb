import {
  getChipset,
  GpuComparison,
  GpuField,
  MarketSegmentValue,
} from '@pcpartdb/shared';
import { formatGpuField } from '../../../utils';

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

export function getContentTags(comparison: GpuComparison) {
  return {
    ...getGeneralTags(comparison),
    ...getPerformanceTags(comparison),
    ...getMemoryTags(comparison),
    ...getCompatibilityTags(comparison),
    ...getPowerSupplyTags(comparison),
  };
}

function getGeneralTags(comparison: GpuComparison) {
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

function getPerformanceTags(comparison: GpuComparison) {
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

function getMemoryTags(comparison: GpuComparison) {
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

function getCompatibilityTags(comparison: GpuComparison) {
  return {
    [CompareGpusContentTag.DifferentSlotWidth]:
      hasDifferentSlotWidth(comparison),
    [CompareGpusContentTag.SameSlotWidth]: hasSameSlotWidth(comparison),
    [CompareGpusContentTag.DifferentOutputs]: hasDifferentOutputs(comparison),
    [CompareGpusContentTag.SameOutputs]: hasSameOutputs(comparison),
  };
}

function getPowerSupplyTags(comparison: GpuComparison) {
  return {
    [CompareGpusContentTag.DifferentTdp]: hasDifferentTdp(comparison),
    [CompareGpusContentTag.SameTdp]: hasSameTdp(comparison),
    [CompareGpusContentTag.DifferentPsu]: hasDifferentPsu(comparison),
    [CompareGpusContentTag.SamePsu]: hasSamePsu(comparison),
  };
}

function hasDifferentCompany(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.company, gpu2.company);
}

function hasSameCompany(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.company, gpu2.company);
}

function hasDifferentMarketSegment(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.marketSegment, gpu2.marketSegment);
}

function hasSameMarketSegment(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.marketSegment, gpu2.marketSegment);
}

function hasDifferentReleaseDate(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.releaseDate == null || gpu2.releaseDate == null) {
    return false;
  }

  return formatGpuField(gpu1.releaseDate) !== formatGpuField(gpu2.releaseDate);
}

function hasSameReleaseDate(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.releaseDate == null || gpu2.releaseDate == null) {
    return false;
  }

  return formatGpuField(gpu1.releaseDate) === formatGpuField(gpu2.releaseDate);
}

function hasDifferentLaunchPrice(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.launchPrice, gpu2.launchPrice);
}

function hasSameLaunchPrice(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.launchPrice, gpu2.launchPrice);
}

function hasDifferentPerformance(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    getChipset(gpu1).performanceScore,
    getChipset(gpu2).performanceScore,
  );
}

function hasSamePerformance(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(
    getChipset(gpu1).performanceScore,
    getChipset(gpu2).performanceScore,
  );
}

function hasDifferentPerformancePerDollar(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(
    getChipset(gpu1).valueScore,
    getChipset(gpu2).valueScore,
  );
}

function hasSamePerformancePerDollar(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(getChipset(gpu1).valueScore, getChipset(gpu2).valueScore);
}

function hasDifferentMemorySize(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.memorySize, gpu2.memorySize);
}

function hasSameMemorySize(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.memorySize, gpu2.memorySize);
}

function hasSameMemoryType(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.memoryType, gpu2.memoryType);
}

function hasDifferentMemoryBandwidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.memoryBandwidth, gpu2.memoryBandwidth);
}

function hasSameMemoryBandwidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.memoryBandwidth, gpu2.memoryBandwidth);
}

function hasDifferentSlotWidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.slotWidth, gpu2.slotWidth);
}

function hasSameSlotWidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.slotWidth, gpu2.slotWidth);
}

function hasDifferentOutputs(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (
    gpu1.marketSegment?.value === MarketSegmentValue.Mobile ||
    gpu2.marketSegment?.value
  ) {
    // Mobile GPUs don't have outputs.
    return false;
  }
  return hasDifferentValue(gpu1.outputs, gpu2.outputs);
}

function hasSameOutputs(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (
    gpu1.marketSegment?.value === MarketSegmentValue.Mobile ||
    gpu2.marketSegment?.value
  ) {
    // Mobile GPUs don't have outputs.
    return false;
  }
  return hasSameValue(gpu1.outputs, gpu2.outputs);
}

function hasDifferentTdp(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.thermalDesignPower, gpu2.thermalDesignPower);
}

function hasSameTdp(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.thermalDesignPower, gpu2.thermalDesignPower);
}

function hasDifferentPsu(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasDifferentValue(gpu1.suggestedPsu, gpu2.suggestedPsu);
}

function hasSamePsu(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  return hasSameValue(gpu1.suggestedPsu, gpu2.suggestedPsu);
}

function hasDifferentValue(field1?: GpuField, field2?: GpuField) {
  if (field1?.value == null || field2?.value == null) {
    return false;
  }

  return field1.value !== field2.value;
}

function hasSameValue(field1?: GpuField, field2?: GpuField) {
  if (field1?.value == null || field2?.value == null) {
    return false;
  }

  return field1.value === field2.value;
}
