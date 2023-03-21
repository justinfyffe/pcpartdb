export enum ContentTag {
  BestPerformance = 'BEST_PERFORMANCE',
  BestPerformanceSegmentCompany = 'BEST_PERFORMANCE_SEGMENT_COMPANY',
  BestPerformanceSegmentYear = 'BEST_PERFORMANCE_SEGMENT_YEAR',
  BestValue = 'BEST_VALUE',

  Launched = 'LAUNCHED',

  CommonSize = 'COMMON_SIZE',
  ExtraLargeSize = 'EXTRA_LARGE_SIZE',
  LargeSize = 'LARGE_SIZE',
  SmallSize = 'SMALL_SIZE',
}

export type ContentTags = string[] | Record<string, boolean>;
