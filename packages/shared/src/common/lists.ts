export interface ListPagination {
  limit?: number;
  offset?: number;
}

export enum ListSort {
  Id = 'id',
  Name = 'name',
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

export interface ListResponse<TQuery = unknown, TResult = unknown> {
  query: TQuery;
  results: TResult[];
  total: number;
}
