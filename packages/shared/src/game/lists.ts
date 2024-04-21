import { ListOrder, ListQuery, ListSort } from '../common';

export const DEFAULT_LIST_GAMES_LIMIT = 50;
export const DEFAULT_LIST_GAMES_OFFSET = 0;
export const DEFAULT_LIST_GAMES_SORT = ListSort.Name;
export const DEFAULT_LIST_GAMES_ORDER = ListOrder.Asc;

export interface ListGamesFilter {
  // List games that match the search query
  search?: string;
}
export interface ListGamesQuery extends ListQuery<ListGamesFilter> {
  filter: ListGamesFilter;
}

export interface ListGamesAdditionalData {
  //
}

export interface GenerateListGamesQueryFromPathOptions {
  path: string;
  defaults?: Record<string, any>;
}

export function generateListGamesQueryFromPath(
  options: GenerateListGamesQueryFromPathOptions,
) {
  const { path, defaults } = options;

  // Handle generic cases

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);

  return generateListGamesQueryFromSearchParams({
    query: Object.fromEntries(params),
    defaults,
  });
}

export interface GenerateListGamesQueryFromSearchParamsOptions {
  query: Record<string, string | string[]>;
  defaults?: Record<string, any>;
}

export function generateListGamesQueryFromSearchParams(
  options: GenerateListGamesQueryFromSearchParamsOptions,
): ListGamesQuery {
  const { query, defaults } = options;
  const offset = Number(
    query.offset ?? defaults?.offset ?? DEFAULT_LIST_GAMES_OFFSET,
  );
  const limit = Number(
    query.limit ?? defaults?.limit ?? DEFAULT_LIST_GAMES_LIMIT,
  );

  const search = query.search as string;
  const sort =
    (query.sort as ListSort) ?? defaults?.sort ?? DEFAULT_LIST_GAMES_SORT;
  const order =
    (query.order as ListOrder) ?? defaults?.sort ?? DEFAULT_LIST_GAMES_ORDER;

  return {
    filter: { search },
    orderBy: { sort, order },
    pagination: { offset, limit },
  };
}
