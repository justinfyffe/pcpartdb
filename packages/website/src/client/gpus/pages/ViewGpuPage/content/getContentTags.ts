import { Gpu, hasGpuLaunched } from '@pcpartdb/shared';

export enum ViewGpuContentTag {
  BestPerformance = 'BEST_PERFORMANCE',
  BestPerformanceForArchitectureSegment = 'BEST_PERFORMANCE_FOR_ARCHITECTURE_SEGMENT',
  BestPerformanceForCompanySegment = 'BEST_PERFORMANCE_FOR_COMPANY_SEGMENT',
  BestPerformanceForSegmentYear = 'BEST_PERFORMANCE_FOR_SEGMENT_YEAR',
  BestValue = 'BEST_VALUE',
  BestValueForSegment = 'BEST_VALUE_FOR_SEGMENT',

  Launched = 'LAUNCHED',

  CommonSize = 'COMMON_SIZE',
  ExtraLargeSize = 'EXTRA_LARGE_SIZE',
  LargeSize = 'LARGE_SIZE',
  SmallSize = 'SMALL_SIZE',
  CompactSize = 'COMPACT_SIZE',
}

export function getContentTags(gpu: Gpu) {
  const slots = gpu.slotWidth?.value;

  return {
    [ViewGpuContentTag.BestPerformance]: gpu.ranks?.performanceRank === 1,
    [ViewGpuContentTag.BestPerformanceForArchitectureSegment]:
      gpu.ranks?.performanceRankForArchitectureSegment === 1,
    [ViewGpuContentTag.BestPerformanceForCompanySegment]:
      gpu.ranks?.performanceRankForCompanySegment === 1,
    [ViewGpuContentTag.BestPerformanceForSegmentYear]:
      gpu.ranks?.performanceRankForSegmentYear === 1,
    [ViewGpuContentTag.BestValue]: gpu.ranks?.valueRank === 1,

    [ViewGpuContentTag.Launched]: hasGpuLaunched(gpu),

    [ViewGpuContentTag.ExtraLargeSize]: slots > 3,
    [ViewGpuContentTag.LargeSize]: slots > 2.5 && slots <= 3,
    [ViewGpuContentTag.CommonSize]: slots <= 2.5 && slots >= 2,
    [ViewGpuContentTag.SmallSize]: slots < 2 && slots >= 1.5,
    [ViewGpuContentTag.CompactSize]: slots < 1.5,
  };
}
