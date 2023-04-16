export enum ContentTag {
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

export type ContentTags = string[] | Record<string, boolean>;
