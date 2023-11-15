export enum RankKey {
  // CPU & GPU
  PerformanceRating = 'PERFORMANCE_RATING',
  PerformanceRatingForMarketSegment = 'PERFORMANCE_RATING_FOR_MARKET_SEGMENT',

  PerformancePerMsrp = 'PERFORMANCE_PER_MSRP',
  PerformancePerMsrpForMarketSegment = 'PERFORMANCE_PER_MSRP_FOR_MARKET_SEGMENT',

  // GPU-only
  PerformanceRatingForArchitectureMarketSegment = 'PERFORMANCE_RATING_FOR_ARCHITECTURE_MARKET_SEGMENT',
}

export interface ProductRankMeta {}

export interface ProductRank {
  id?: number;
  productId?: number;

  rankKey: RankKey;
  rank?: number;

  metadata?: ProductRankMeta;
}
