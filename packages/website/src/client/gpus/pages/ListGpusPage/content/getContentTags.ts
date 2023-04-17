import { GpuSort, GpusQuery } from '@pcpartdb/shared';

export enum ListGpusContentTag {
  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
}

export function getContentTags(query: GpusQuery) {
  return {
    [ListGpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === GpuSort.PerformanceRating,
    [ListGpusContentTag.SortedBestValue]:
      query.orderBy?.sort === GpuSort.ValueRating,
  };
}
