import { ListCpusOrder, ListCpusQuery, ListCpusSort } from '@pcpartdb/shared';

export enum ListCpusContentTag {
  OrderedAsc = 'ORDERED_ASC',
  OrderedDesc = 'ORDERED_DESC',

  SortedBestPerformance = 'SORTED_BEST_PERFORMANCE',
  SortedBestValue = 'SORTED_BEST_VALUE',
  SortedReleaseDate = 'SORTED_RELEASE_DATE',
}

export function getContentTags(query: ListCpusQuery) {
  return {
    [ListCpusContentTag.OrderedAsc]: query.orderBy?.order === ListCpusOrder.Asc,
    [ListCpusContentTag.OrderedDesc]:
      query.orderBy?.order == null ||
      query.orderBy?.order === ListCpusOrder.Desc,
    [ListCpusContentTag.SortedBestPerformance]:
      query.orderBy?.sort == null ||
      query.orderBy?.sort === ListCpusSort.PerformanceRating,
    [ListCpusContentTag.SortedBestValue]:
      query.orderBy?.sort === ListCpusSort.ValueRating,
    [ListCpusContentTag.SortedReleaseDate]:
      query.orderBy?.sort === ListCpusSort.ReleaseDate,
  };
}
