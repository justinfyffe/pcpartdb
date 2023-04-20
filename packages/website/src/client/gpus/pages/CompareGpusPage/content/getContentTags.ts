import { GpuComparison } from '@pcpartdb/shared';
import { parse } from 'date-fns';
import { formatGpuField } from '../../../utils';

export enum CompareGpusContentTag {
  SameCompany = 'SAME_COMPANY',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  SameReleaseYear = 'SAME_RELEASE_YEAR',
  SameLength = 'SAME_LENGTH',
  SameSlotWidth = 'SAME_SLOT_WIDTH',
  DifferentBetterPerformanceAndValue = 'DIFFERENT_BETTER_PERFORMANCE_AND_VALUE',
  SameMemorySize = 'SAME_MEMORY_SIZE',
  SameMemoryType = 'SAME_MEMORY_TYPE',
  SameMemoryBandwidth = 'SAME_MEMORY_BANDWIDTH',
  DifferentMemorySize = 'DIFFERENT_MEMORY_SIZE',
  DifferentMemoryBandwidth = 'DIFFERENT_MEMORY_BANDWIDTH',
  MoreMemorySizeAndBandwidth = 'MORE_MEMORY_SIZE_AND_BANDWIDTH',
}

export function getContentTags(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  const sameCompany = gpu1.company?.value === gpu2.company?.value;

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
  const sameSlotWidth = gpu1.slotWidth?.value === gpu2.slotWidth?.value;

  return {
    [CompareGpusContentTag.SameCompany]: sameCompany,
    [CompareGpusContentTag.SameMarketSegment]: sameMarketSegment,
    [CompareGpusContentTag.SameReleaseDate]: sameReleaseDate,
    [CompareGpusContentTag.SameReleaseYear]: sameReleaseYear,
    [CompareGpusContentTag.DifferentBetterPerformanceAndValue]:
      differentBetterPerformanceAndValue,
    [CompareGpusContentTag.SameSlotWidth]: sameSlotWidth,
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
  };
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
