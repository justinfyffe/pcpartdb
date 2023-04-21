import { GpuComparison, GpuField, MarketSegmentValue } from '@pcpartdb/shared';
import { parse } from 'date-fns';
import { formatGpuField } from '../../../utils';

export enum CompareGpusContentTag {
  DifferentCompany = 'DIFFERENT_COMPANY',
  SameCompany = 'SAME_COMPANY',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  SameReleaseYear = 'SAME_RELEASE_YEAR',
  SameLength = 'SAME_LENGTH',

  DifferentBetterPerformanceAndValue = 'DIFFERENT_BETTER_PERFORMANCE_AND_VALUE',
  SameMemorySize = 'SAME_MEMORY_SIZE',
  SameMemoryType = 'SAME_MEMORY_TYPE',
  SameMemoryBandwidth = 'SAME_MEMORY_BANDWIDTH',
  DifferentMemorySize = 'DIFFERENT_MEMORY_SIZE',
  DifferentMemoryBandwidth = 'DIFFERENT_MEMORY_BANDWIDTH',
  MoreMemorySizeAndBandwidth = 'MORE_MEMORY_SIZE_AND_BANDWIDTH',

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
  const [gpu1, gpu2] = comparison;

  const sameMarketSegment =
    gpu1.marketSegment?.value === gpu2.marketSegment?.value;

  let sameReleaseDate = false;
  let sameReleaseYear = false;
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    const gpu1Year = parse(gpu1.releaseDate.value, 'yyyy-MM-dd', new Date());
    const gpu2Year = parse(gpu2.releaseDate.value, 'yyyy-MM-dd', new Date());
    sameReleaseDate =
      formatGpuField(gpu1.releaseDate) === formatGpuField(gpu2.releaseDate);
    sameReleaseYear = gpu1Year.getUTCFullYear() === gpu2Year.getUTCFullYear();
  }

  let differentBetterPerformanceAndValue = false;
  if (
    gpu1.performanceScore?.value != null &&
    gpu2.performanceScore?.value != null &&
    gpu1.valueScore?.value != null &&
    gpu2.valueScore?.value != null
  ) {
    const performanceScore1 = gpu1.performanceScore?.value;
    const performanceScore2 = gpu2.performanceScore?.value;
    const valueScore1 = gpu1.valueScore?.value;
    const valueScore2 = gpu2.valueScore?.value;
    differentBetterPerformanceAndValue =
      (performanceScore1 > performanceScore2 && valueScore2 > valueScore1) ||
      (performanceScore2 > performanceScore1 && valueScore1 > valueScore2);
  }

  const sameLength = gpu1.length?.value === gpu2.length?.value;

  return {
    [CompareGpusContentTag.DifferentCompany]: hasDifferentCompany(comparison),
    [CompareGpusContentTag.SameCompany]: hasSameCompany(comparison),
    [CompareGpusContentTag.SameMarketSegment]: sameMarketSegment,
    [CompareGpusContentTag.SameReleaseDate]: sameReleaseDate,
    [CompareGpusContentTag.SameReleaseYear]: sameReleaseYear,
    [CompareGpusContentTag.DifferentBetterPerformanceAndValue]:
      differentBetterPerformanceAndValue,

    [CompareGpusContentTag.SameLength]: sameLength,
    [CompareGpusContentTag.SameMemorySize]: hasSameMemorySize(comparison),
    [CompareGpusContentTag.SameMemoryType]: hasSameMemoryType(comparison),
    [CompareGpusContentTag.SameMemoryBandwidth]:
      hasSameMemoryBandwidth(comparison),
    [CompareGpusContentTag.DifferentMemoryBandwidth]:
      hasDifferentMemoryBandwidth(comparison),
    [CompareGpusContentTag.DifferentMemorySize]:
      hasDifferentMemorySize(comparison),
    [CompareGpusContentTag.MoreMemorySizeAndBandwidth]:
      hasMoreMemorySizeAndBandwidth(comparison),

    ...getCompatibilityTags(comparison),
    ...getPowerSupplyTags(comparison),
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

function hasSameMemorySize(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (gpu1.memorySize?.value == null || gpu2.memorySize?.value == null) {
    return false;
  }

  return gpu1.memorySize.value === gpu2.memorySize.value;
}

function hasSameMemoryType(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (gpu1.memoryType?.value == null || gpu2.memoryType?.value == null) {
    return false;
  }

  return gpu1.memoryType.value === gpu2.memoryType.value;
}

function hasSameMemoryBandwidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (
    gpu1.memoryBandwidth?.value == null ||
    gpu2.memoryBandwidth?.value == null
  ) {
    return false;
  }

  return gpu1.memoryBandwidth.value === gpu2.memoryBandwidth.value;
}

function hasDifferentMemorySize(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (gpu1.memorySize?.value == null || gpu2.memorySize?.value == null) {
    return false;
  }

  return gpu1.memorySize.value !== gpu2.memorySize.value;
}

function hasDifferentMemoryBandwidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (
    gpu1.memoryBandwidth?.value == null ||
    gpu2.memoryBandwidth?.value == null
  ) {
    return false;
  }

  return gpu1.memoryBandwidth.value !== gpu2.memoryBandwidth.value;
}

function hasMoreMemorySizeAndBandwidth(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  if (
    gpu1.memorySize?.value > gpu2.memorySize?.value &&
    gpu1.memoryBandwidth?.value > gpu2.memoryBandwidth?.value
  ) {
    return true;
  }

  if (
    gpu2.memorySize?.value > gpu1.memorySize?.value &&
    gpu2.memoryBandwidth?.value > gpu1.memoryBandwidth?.value
  ) {
    return true;
  }

  return false;
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
