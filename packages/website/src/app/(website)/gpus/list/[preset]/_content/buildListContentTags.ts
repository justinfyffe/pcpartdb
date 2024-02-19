import { ListGpusQuery, ListOrder, ListSort } from '@pcpartdb/shared';

export enum ListGpusContentTag {
  OrderedAsc = 'ORDERED_ASC',
  OrderedDesc = 'ORDERED_DESC',

  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
  SortedReleaseDate = 'SORTED_RELEASE_DATE',
}

export function buildListContentTags(query: ListGpusQuery) {
  return {
    [ListGpusContentTag.OrderedAsc]: query.orderBy?.order === ListOrder.Asc,
    [ListGpusContentTag.OrderedDesc]:
      query.orderBy?.order == null || query.orderBy?.order === ListOrder.Desc,
    [ListGpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === ListSort.PerformanceRating,
    [ListGpusContentTag.SortedBestValue]:
      query.orderBy?.sort === ListSort.PerformancePerMsrp,
    [ListGpusContentTag.SortedReleaseDate]:
      query.orderBy?.sort === ListSort.ReleaseDate,
  };
}
