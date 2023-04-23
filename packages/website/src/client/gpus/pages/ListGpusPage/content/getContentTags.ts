import { GpuOrder, GpuSort, GpusQuery } from '@pcpartdb/shared';

export enum ListGpusContentTag {
  OrderedAsc = 'ORDERED_ASC',
  OrderedDesc = 'ORDERED_DESC',

  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
  SortedReleaseDate = 'SORTED_RELEASE_DATE',
}

export function getContentTags(query: GpusQuery) {
  return {
    [ListGpusContentTag.OrderedAsc]: query.orderBy?.order === GpuOrder.Asc,
    [ListGpusContentTag.OrderedDesc]:
      query.orderBy?.order == null || query.orderBy?.order === GpuOrder.Desc,
    [ListGpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === GpuSort.PerformanceRating,
    [ListGpusContentTag.SortedBestValue]:
      query.orderBy?.sort === GpuSort.ValueRating,
    [ListGpusContentTag.SortedReleaseDate]:
      query.orderBy?.sort === GpuSort.ReleaseDate,
  };
}
