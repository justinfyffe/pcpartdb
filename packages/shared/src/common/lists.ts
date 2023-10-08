export interface ListPagination {
  limit?: number;
  offset?: number;
}

export enum ListSort {
  Id = 'id',
  Name = 'name',
  ReleaseDate = 'release_date',
  PerformanceRating = 'performance_rating',
  PerformancePerMsrp = 'performance_per_msrp',
}

export enum ListOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ListOrderBy {
  sort?: ListSort;
  order?: ListOrder;
}

export interface ListQuery<TFilter = unknown> {
  filter?: TFilter;
  orderBy?: ListOrderBy;
  pagination?: ListPagination;
}

export interface ListRequest<TQuery = ListQuery> {
  query: TQuery;
}

export interface ListResponse<
  TQuery = unknown,
  TResult = unknown,
  TAdditionalData = unknown,
> {
  query?: TQuery;
  results: TResult[];
  total: number;
  additionalData?: TAdditionalData;
}
