import { GpuComparison, GpuField, MarketSegmentValue } from '@pcpartdb/shared';
import { parse } from 'date-fns';
import { DateFormatter } from 'packages/website/src/client/shared/format';
import { formatGpuField } from '../../../utils';

export enum CompareGpusContentTag {
  DifferentCompany = 'DIFFERENT_COMPANY',
  SameCompany = 'SAME_COMPANY',
  DifferentMarketSegment = 'DIFFERENT_MARKET_SEGMENT',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  DifferentReleaseDate = 'DIFFERENT_RELEASE_DATE',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  DifferentReleaseYear = 'DIFFERENT_RELEASE_YEAR',
  SameReleaseYear = 'SAME_RELEASE_YEAR',

  DifferentBetterPerformanceAndValue = 'DIFFERENT_BETTER_PERFORMANCE_AND_VALUE',

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
  const [gpu1, gpu2] = comparison;

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

  return {
    [CompareGpusContentTag.DifferentBetterPerformanceAndValue]:
      differentBetterPerformanceAndValue,

    ...getGeneralTags(comparison),
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
    [CompareGpusContentTag.DifferentReleaseYear]:
      hasDifferentReleaseYear(comparison),
    [CompareGpusContentTag.SameReleaseYear]: hasSameReleaseYear(comparison),
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

function hasDifferentReleaseYear(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.releaseDate == null || gpu2.releaseDate == null) {
    return false;
  }

  return (
    formatGpuField(gpu1.releaseDate, { dateFormatter: DateFormatter.Year }) !==
    formatGpuField(gpu2.releaseDate, { dateFormatter: DateFormatter.Year })
  );
}

function hasSameReleaseYear(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;
  if (gpu1.releaseDate == null || gpu2.releaseDate == null) {
    return false;
  }

  return (
    formatGpuField(gpu1.releaseDate, { dateFormatter: DateFormatter.Year }) ===
    formatGpuField(gpu2.releaseDate, { dateFormatter: DateFormatter.Year })
  );
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
