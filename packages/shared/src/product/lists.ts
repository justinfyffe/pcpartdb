import { ListOrder, ListQuery, ListSort } from '../common';
import { getListCpusPath, getListGpusPath } from '../routes';
import { ProductType } from './common';
import { MarketSegment } from './fields';

//
// Generic Product Lists
//

export const DEFAULT_LIST_PRODUCTS_LIMIT = 50;
export const DEFAULT_LIST_PRODUCTS_OFFSET = 0;
export const DEFAULT_LIST_PRODUCTS_SORT = ListSort.Id;
export const DEFAULT_LIST_PRODUCTS_ORDER = ListOrder.Desc;

export type BaseListProductsFilter = {
  productType: ProductType;
  search?: string;
};
export type ListProductsFilter =
  | BaseListProductsFilter
  | ListCpusFilter
  | ListGpusFilter;
export interface ListProductsQuery extends ListQuery<ListProductsFilter> {
  filter: ListProductsFilter;
}

export interface GenerateListProductsQueryFromPathOptions {
  productType: ProductType;
  path: string;
  defaults?: Record<string, any>;
}

export function generateListProductsQueryFromPath(
  options: GenerateListProductsQueryFromPathOptions,
) {
  const { productType, path, defaults } = options;

  // Handle specific cases
  if (productType === ProductType.Cpu) {
    return generateListCpusQueryFromPath({ path, defaults });
  } else if (productType === ProductType.Gpu) {
    return generateListGpusQueryFromPath({ path, defaults });
  }

  // Handle generic cases

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);

  return generateListProductsQueryFromSearchParams({
    productType,
    query: Object.fromEntries(params),
    defaults,
  });
}

export interface GenerateListProductsQueryFromSearchParamsOptions {
  productType: ProductType;
  query: Record<string, string | string[]>;
  defaults?: Record<string, any>;
}

export function generateListProductsQueryFromSearchParams(
  options: GenerateListProductsQueryFromSearchParamsOptions,
): ListProductsQuery {
  const { productType, query, defaults } = options;
  const offset = Number(
    query.offset ?? defaults?.offset ?? DEFAULT_LIST_PRODUCTS_OFFSET,
  );
  const limit = Number(
    query.limit ?? defaults?.limit ?? DEFAULT_LIST_PRODUCTS_LIMIT,
  );

  const search = query.search as string;
  const sort =
    (query.sort as ListSort) ?? defaults?.sort ?? DEFAULT_LIST_PRODUCTS_SORT;
  const order =
    (query.order as ListOrder) ?? defaults?.sort ?? DEFAULT_LIST_PRODUCTS_ORDER;

  return {
    filter: { productType, search },
    orderBy: { sort, order },
    pagination: { offset, limit },
  };
}

//
// CPU Lists
//

export const DEFAULT_LIST_CPUS_LIMIT = 50;
export const DEFAULT_LIST_CPUS_OFFSET = 0;
export const DEFAULT_LIST_CPUS_SORT = ListSort.PerformanceRating;
export const DEFAULT_LIST_CPUS_ORDER = ListOrder.Desc;

export enum ListCpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceIntel = 'best-performance-intel',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueIntel = 'best-value-intel',
  Newest = 'newest',
  Oldest = 'oldest',
}

export const LIST_CPUS_PRESETS: Record<ListCpusPresetSlug, ListCpusQuery> = {
  [ListCpusPresetSlug.BestPerformance]: {
    filter: { productType: ProductType.Cpu },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceAmd]: {
    filter: { productType: ProductType.Cpu, company: ['amd'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestPerformanceIntel]: {
    filter: { productType: ProductType.Cpu, company: ['intel'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListCpusPresetSlug.BestValue]: {
    filter: { productType: ProductType.Cpu },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueAmd]: {
    filter: { productType: ProductType.Cpu, company: ['amd'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.BestValueIntel]: {
    filter: { productType: ProductType.Cpu, company: ['intel'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.Newest]: {
    filter: { productType: ProductType.Cpu },
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Desc },
  },
  [ListCpusPresetSlug.Oldest]: {
    filter: { productType: ProductType.Cpu },
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Asc },
  },
};

export interface ListCpusFilter extends BaseListProductsFilter {
  productType: ProductType.Cpu;

  company?: string[];
  year?: number[];
  segment?: MarketSegment[];
  hasReleaseDate?: boolean;
  ids?: number[];
  excludeIds?: number[];
}
export interface ListCpusQuery extends ListQuery<ListCpusFilter> {
  filter: ListCpusFilter;
}

export interface ListCpusAdditionalData {
  //
}

export interface GenerateListCpusQueryFromPathOptions {
  path: string;
  defaults?: Record<string, any>;
}

export function generateListCpusQueryFromPath(
  options: GenerateListCpusQueryFromPathOptions,
) {
  const { path, defaults } = options;

  const presetRegex = getListCpusPath('([a-zA-Z0-9-_]+)');
  const matches = path.match(presetRegex);
  const preset = matches != null && matches.length > 1 ? matches[1] : null;

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);
  if (preset != null) {
    params.set('preset', preset);
  }

  return generateListCpusQueryFromSearchParams({
    query: Object.fromEntries(params),
    defaults,
  });
}

export interface GenerateListCpusQueryFromSearchParamsOptions {
  query: Record<string, string | string[]>;
  defaults?: Record<string, any>;
}

export function generateListCpusQueryFromSearchParams(
  options: GenerateListCpusQueryFromSearchParamsOptions,
): ListCpusQuery {
  const { query, defaults } = options;

  const offset = Number(
    query.offset ?? defaults?.offset ?? DEFAULT_LIST_CPUS_OFFSET,
  );
  const limit = Number(
    query.limit ?? defaults?.limit ?? DEFAULT_LIST_CPUS_LIMIT,
  );

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as MarketSegment[];
  const sort =
    (query.sort as ListSort) ?? defaults?.sort ?? DEFAULT_LIST_CPUS_SORT;
  const order =
    (query.order as ListOrder) ?? defaults?.order ?? DEFAULT_LIST_CPUS_ORDER;
  const preset = query.preset as ListCpusPresetSlug;

  if (preset != null && LIST_CPUS_PRESETS[preset] != null) {
    return { ...LIST_CPUS_PRESETS[preset], pagination: { limit, offset } };
  } else {
    return {
      filter: { productType: ProductType.Cpu, company, segment },
      orderBy: { sort, order },
      pagination: { offset, limit },
    };
  }
}

//
// GPU Lists
//

export const DEFAULT_LIST_GPUS_LIMIT = 50;
export const DEFAULT_LIST_GPUS_OFFSET = 0;
export const DEFAULT_LIST_GPUS_SORT = ListSort.PerformanceRating;
export const DEFAULT_LIST_GPUS_ORDER = ListOrder.Desc;

export enum ListGpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceNvidia = 'best-performance-nvidia',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueNvidia = 'best-value-nvidia',
  Newest = 'newest',
  Oldest = 'oldest',
}

export const LIST_GPUS_PRESETS: Record<ListGpusPresetSlug, ListGpusQuery> = {
  [ListGpusPresetSlug.BestPerformance]: {
    filter: { productType: ProductType.Gpu },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceAmd]: {
    filter: { productType: ProductType.Gpu, company: ['amd'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestPerformanceNvidia]: {
    filter: { productType: ProductType.Gpu, company: ['nvidia'] },
    orderBy: {
      sort: ListSort.PerformanceRating,
      order: ListOrder.Desc,
    },
  },
  [ListGpusPresetSlug.BestValue]: {
    filter: { productType: ProductType.Gpu },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueAmd]: {
    filter: { productType: ProductType.Gpu, company: ['amd'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListGpusPresetSlug.BestValueNvidia]: {
    filter: { productType: ProductType.Gpu, company: ['nvidia'] },
    orderBy: { sort: ListSort.PerformancePerMsrp, order: ListOrder.Desc },
  },
  [ListGpusPresetSlug.Newest]: {
    filter: { productType: ProductType.Gpu, hasReleaseDate: true },
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Desc },
  },
  [ListGpusPresetSlug.Oldest]: {
    filter: { productType: ProductType.Gpu, hasReleaseDate: true },
    orderBy: { sort: ListSort.ReleaseDate, order: ListOrder.Asc },
  },
};

export interface ListGpusFilter extends BaseListProductsFilter {
  productType: ProductType.Gpu;

  company?: string[];
  year?: number[];
  segment?: MarketSegment[];

  hasReleaseDate?: boolean;

  minPerformanceScore?: number;
  maxValueScore?: number;
  minValueScore?: number;

  performanceRated?: boolean;
  valueRated?: boolean;

  chipsetId?: number[];
  isChipset?: boolean;
  isRetailModel?: boolean;

  ids?: number[];
  excludeIds?: number[];
}
export interface ListGpusQuery extends ListQuery<ListGpusFilter> {
  filter: ListGpusFilter;
}

export interface ListGpusAdditionalData {
  retailModelCounts?: Record<number, number>;
}

export interface GenerateListGpusQueryFromPathOptions {
  path: string;
  defaults?: Record<string, any>;
}

export function generateListGpusQueryFromPath(
  options: GenerateListGpusQueryFromPathOptions,
) {
  const { path, defaults } = options;

  const presetRegex = getListGpusPath('([a-zA-Z0-9-_]+)');
  const matches = path.match(presetRegex);
  const preset = matches != null && matches.length > 1 ? matches[1] : null;

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);
  if (preset != null) {
    params.set('preset', preset);
  }

  return generateListGpusQueryFromSearchParams({
    query: Object.fromEntries(params),
    defaults,
  });
}

export interface GenerateListGpusQueryFromSearchParamsOptions {
  query: Record<string, string | string[]>;
  defaults?: Record<string, any>;
}

export function generateListGpusQueryFromSearchParams(
  options: GenerateListGpusQueryFromSearchParamsOptions,
): ListGpusQuery {
  const { query, defaults } = options;

  const offset = Number(
    query.offset ?? defaults?.offset ?? DEFAULT_LIST_GPUS_OFFSET,
  );
  const limit = Number(
    query.limit ?? defaults?.limit ?? DEFAULT_LIST_GPUS_LIMIT,
  );

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as MarketSegment[];
  const sort =
    (query.sort as ListSort) ?? defaults?.sort ?? DEFAULT_LIST_GPUS_SORT;
  const order =
    (query.order as ListOrder) ?? defaults?.order ?? DEFAULT_LIST_GPUS_ORDER;
  const preset = query.preset as ListGpusPresetSlug;

  if (preset != null && LIST_GPUS_PRESETS[preset] != null) {
    return { ...LIST_GPUS_PRESETS[preset], pagination: { limit, offset } };
  } else {
    return {
      filter: {
        productType: ProductType.Gpu,
        company,
        segment,
        hasReleaseDate: sort === ListSort.ReleaseDate ? true : undefined,
      },
      orderBy: { sort, order },
      pagination: { offset, limit },
    };
  }
}
