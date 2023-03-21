export enum ContentTag {
  BestPerformance = 'BEST_PERFORMANCE',
  BestPerformanceCompany = 'BEST_PERFORMANCE_COMPANY',
  BestPerformanceYear = 'BEST_PERFORMANCE_YEAR',
  BestValue = 'BEST_VALUE',

  Launched = 'LAUNCHED',

  CommonSize = 'COMMON_SIZE',
  ExtraLargeSize = 'EXTRA_LARGE_SIZE',
  LargeSize = 'LARGE_SIZE',
  SmallSize = 'SMALL_SIZE',
}

export type ContentTags = string[] | Record<string, boolean>;
