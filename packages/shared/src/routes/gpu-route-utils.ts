import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  LIST_GPUS_PRESETS,
  ListGpusQuery,
} from '../product';
import { joinUrlParts } from '../utils';
import {
  GetCompareProductsPathOptions,
  GetViewProductPathOptions,
} from './product-route-utils';

export function getListGpusPath(presetOrQuery?: ListGpusQuery | string) {
  const basePath = '/gpus/list/';

  if (presetOrQuery == null) {
    return basePath;
  }

  if (typeof presetOrQuery === 'string') {
    return joinUrlParts(basePath, presetOrQuery, '/');
  }

  const query = presetOrQuery;
  const paginationParams =
    query != null
      ? Object.fromEntries(generatePaginationParamsFromGpusQuery(query))
      : {};

  // Check if the rest of the query is a preset or not.
  const preset = getListGpusPresetEquivalent(query);
  if (preset != null) {
    const q = new URLSearchParams(paginationParams).toString();
    return joinUrlParts(basePath, preset, q ? `?${q}` : '');
  }

  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromGpusQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  return joinUrlParts(basePath, combinedParams ? `?${combinedParams}` : '');
}

export function getViewGpuPath(options: GetViewProductPathOptions) {
  let slug: string;
  if (options.product != null) {
    slug = options.product.slug;
  } else if (options.slug != null) {
    slug = options.slug;
  } else {
    throw new Error('Need to set product or slug for getting view gpu path');
  }

  return joinUrlParts('/gpus/view/', slug, '/');
}

export function getCompareGpusPath(options: GetCompareProductsPathOptions) {
  const { comparison, ordered } = options;

  if (comparison == null) {
    throw new Error(
      'Need to set comparison or slugs for getting compare gpus path',
    );
  }

  const parts = ordered
    ? [...comparison].sort((a, b) => a.id - b.id)
    : comparison;

  const slug1 = parts[0].slug;
  const slug2 = parts[1].slug;

  return joinUrlParts('/gpus/compare/', `${slug1}--vs--${slug2}`, '/');
}

function generatePaginationParamsFromGpusQuery(query: ListGpusQuery) {
  const params = new URLSearchParams();

  if (
    query?.pagination?.limit != null &&
    query.pagination.limit !== DEFAULT_LIST_GPUS_LIMIT
  ) {
    params.append('limit', `${query.pagination.limit}`);
  }

  if (
    query?.pagination?.offset != null &&
    query.pagination.offset !== DEFAULT_LIST_GPUS_OFFSET
  ) {
    params.append('offset', `${query.pagination.offset}`);
  }

  return params;
}

function generateSearchParamsFromGpusQuery(query: ListGpusQuery) {
  const params = new URLSearchParams();

  if (query.filter?.company?.length > 0) {
    params.append('company', query.filter.company.join(','));
  }

  if (query.filter?.segment?.length > 0) {
    params.append('segment', query.filter.segment.join(',').toLowerCase());
  }

  if (query.orderBy?.sort) {
    params.append('sort', query.orderBy.sort);
  }

  if (query.orderBy?.order) {
    params.append('order', query.orderBy.order);
  }

  return params;
}

function getListGpusPresetEquivalent(query: ListGpusQuery) {
  const presets = Object.entries(LIST_GPUS_PRESETS);

  for (const [key, preset] of presets) {
    if (areGpuQueriesEqual(query, preset)) {
      return key;
    }
  }

  return null;
}

function areGpuQueriesEqual(query1: ListGpusQuery, query2: ListGpusQuery) {
  const sort1 = query1.orderBy?.sort;
  const sort2 = query2.orderBy?.sort;
  const order1 = query1.orderBy?.order;
  const order2 = query2.orderBy?.order;
  const company1 = query1.filter?.company ?? [];
  const company2 = query2.filter?.company ?? [];
  const segment1 = query1.filter?.segment ?? [];
  const segment2 = query2.filter?.segment ?? [];

  if (sort1 !== sort2) {
    return false;
  }

  if (order1 !== order2) {
    return false;
  }

  if (!company1.every((company) => company2.includes(company))) {
    return false;
  }

  if (!segment1.every((segment) => segment2.includes(segment))) {
    return false;
  }

  return true;
}
