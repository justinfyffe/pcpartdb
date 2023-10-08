import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  GpuProduct,
  LIST_GPUS_PRESETS,
  ListProductsQuery,
} from '../product';
import { joinUrlParts } from '../utils';
import {
  GetCompareProductsPathOptions,
  GetViewProductPathOptions,
} from './product-route-utils';

export function getListGpusPath(presetOrQuery?: ListProductsQuery | string) {
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
  const { comparison, slugs } = options;

  let slug1: string;
  let slug2: string;
  if (comparison != null) {
    slug1 = comparison[0].slug;
    slug2 = comparison[1].slug;
  } else if (slugs != null) {
    slug1 = slugs[0];
    slug2 = slugs[1];
  } else {
    throw new Error(
      'Need to set comparison or slugs for getting compare gpus path',
    );
  }

  return joinUrlParts('/gpus/compare/', `${slug1}--vs--${slug2}`, '/');
}

export function getAdminListGpusPath(query?: ListProductsQuery) {
  const path = '/admin/gpus/';

  const paginationParams =
    query != null
      ? Object.fromEntries(generatePaginationParamsFromGpusQuery(query))
      : {};
  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromGpusQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  return joinUrlParts(path, combinedParams ? `?${combinedParams}` : '');
}

export function getAdminNewGpuPath() {
  return '/admin/gpus/new/';
}

export function getAdminEditGpuPath(
  gpuOrIdOrSlug: GpuProduct | number | string,
) {
  if (typeof gpuOrIdOrSlug === 'number') {
    return joinUrlParts('/admin/gpus/', String(gpuOrIdOrSlug), '/');
  } else if (typeof gpuOrIdOrSlug === 'string') {
    return joinUrlParts('/admin/gpus/', gpuOrIdOrSlug, '/');
  } else {
    return joinUrlParts('/admin/gpus/', String(gpuOrIdOrSlug.id), '/');
  }
}

function generatePaginationParamsFromGpusQuery(query: ListProductsQuery) {
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

function generateSearchParamsFromGpusQuery(query: ListProductsQuery) {
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

function getListGpusPresetEquivalent(query: ListProductsQuery) {
  const presets = Object.entries(LIST_GPUS_PRESETS);

  for (const [key, preset] of presets) {
    if (areGpuQueriesEqual(query, preset)) {
      return key;
    }
  }

  return null;
}

function areGpuQueriesEqual(
  query1: ListProductsQuery,
  query2: ListProductsQuery,
) {
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
