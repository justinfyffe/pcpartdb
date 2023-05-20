import { ListGpusOrder, ListGpusQuery, ListGpusSort } from '@pcpartdb/shared';

export enum ListGpusContentTag {
  OrderedAsc = 'ORDERED_ASC',
  OrderedDesc = 'ORDERED_DESC',

  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
  SortedReleaseDate = 'SORTED_RELEASE_DATE',
}

export function getContentTags(query: ListGpusQuery) {
  return {
    [ListGpusContentTag.OrderedAsc]: query.orderBy?.order === ListGpusOrder.Asc,
    [ListGpusContentTag.OrderedDesc]:
      query.orderBy?.order == null ||
      query.orderBy?.order === ListGpusOrder.Desc,
    [ListGpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === ListGpusSort.PerformanceRating,
    [ListGpusContentTag.SortedBestValue]:
      query.orderBy?.sort === ListGpusSort.ValueRating,
    [ListGpusContentTag.SortedReleaseDate]:
      query.orderBy?.sort === ListGpusSort.ReleaseDate,
  };
}
