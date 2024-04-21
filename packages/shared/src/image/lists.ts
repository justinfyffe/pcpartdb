import { ListOrder, ListQuery, ListSort } from '../common';

export const DEFAULT_LIST_IMAGES_LIMIT = 10;
export const DEFAULT_LIST_IMAGES_OFFSET = 0;
export const DEFAULT_LIST_IMAGES_SORT = ListSort.Id;
export const DEFAULT_LIST_IMAGES_ORDER = ListOrder.Desc;

export interface ListImagesFilter {
  // List games that match the search query
  search?: string;
}
export interface ListImagesQuery extends ListQuery<ListImagesFilter> {
  filter?: ListImagesFilter;
}

export interface ListImagesAdditionalData {
  //
}

export interface GenerateListImagesQueryFromPathOptions {
  path: string;
  defaults?: Record<string, any>;
}

export function generateListImagesQueryFromPath(
  options: GenerateListImagesQueryFromPathOptions,
) {
  const { path, defaults } = options;

  // Handle generic cases

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);

  return generateListImagesQueryFromSearchParams({
    query: Object.fromEntries(params),
    defaults,
  });
}

export interface GenerateListImagesQueryFromSearchParamsOptions {
  query: Record<string, string | string[]>;
  defaults?: Record<string, any>;
}

export function generateListImagesQueryFromSearchParams(
  options: GenerateListImagesQueryFromSearchParamsOptions,
): ListImagesQuery {
  const { query, defaults } = options;
  const search = query.search as string;

  return {
    filter: { search },
  };
}
