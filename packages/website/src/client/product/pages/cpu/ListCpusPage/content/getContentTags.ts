import { ListCpusQuery, ListOrder, ListSort } from '@pcpartdb/shared';

export enum ListCpusContentTag {
  OrderedAsc = 'ORDERED_ASC',
  OrderedDesc = 'ORDERED_DESC',

  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
  SortedReleaseDate = 'SORTED_RELEASE_DATE',
}

export function getContentTags(query: ListCpusQuery) {
  return {
    [ListCpusContentTag.OrderedAsc]: query.orderBy?.order === ListOrder.Asc,
    [ListCpusContentTag.OrderedDesc]:
      query.orderBy?.order == null || query.orderBy?.order === ListOrder.Desc,
    [ListCpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === ListSort.PerformanceRating,
    [ListCpusContentTag.SortedBestValue]:
      query.orderBy?.sort === ListSort.PerformancePerMsrp,
    [ListCpusContentTag.SortedReleaseDate]:
      query.orderBy?.sort === ListSort.ReleaseDate,
  };
}
