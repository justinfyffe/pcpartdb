import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  Gpu,
  GpuComparison,
  GpusQuery,
  LIST_GPUS_PRESETS,
} from '../gpu';
import { joinUrlParts } from '../utils';

export function getListGpusPath(presetOrQuery?: GpusQuery | string) {
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

export function getViewGpuPath(gpuOrSlug: Gpu | string) {
  if (gpuOrSlug == null) {
    return null;
  }

  const slug = typeof gpuOrSlug === 'string' ? gpuOrSlug : gpuOrSlug.slug;
  return joinUrlParts('/gpus/view/', slug, '/');
}

interface GetCompareGpusPathOptions {
  ordered?: boolean;
}

export function getCompareGpusPath(
  comparisonOrSlug: GpuComparison | string,
  options?: GetCompareGpusPathOptions,
) {
  if (typeof comparisonOrSlug === 'string') {
    return joinUrlParts('/gpus/compare/', comparisonOrSlug, '/');
  }

  const comparison = comparisonOrSlug;
  const [gpu1, gpu2] =
    options?.ordered === true
      ? [...comparison].sort((p1, p2) => p1.id - p2.id)
      : comparison;

  return joinUrlParts('/gpus/compare/', `${gpu1.slug}--vs--${gpu2.slug}`, '/');
}

export function getAdminListGpusPath(query?: GpusQuery) {
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

export function getAdminEditGpuPath(gpuOrId: Gpu | number) {
  const id = typeof gpuOrId === 'number' ? gpuOrId : gpuOrId.id;
  return joinUrlParts('/admin/gpus/', String(id), '/');
}

function generatePaginationParamsFromGpusQuery(query: GpusQuery) {
  const params = new URLSearchParams();

  if (query.limit != null && query.limit !== DEFAULT_LIST_GPUS_LIMIT) {
    params.append('limit', `${query.limit}`);
  }

  if (query.offset != null && query.offset !== DEFAULT_LIST_GPUS_OFFSET) {
    params.append('offset', `${query.offset}`);
  }

  return params;
}

export function getAdminImportGpusPath() {
  return '/admin/gpus/import';
}

function generateSearchParamsFromGpusQuery(query: GpusQuery) {
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

function getListGpusPresetEquivalent(query: GpusQuery) {
  const presets = Object.entries(LIST_GPUS_PRESETS);

  for (const [key, preset] of presets) {
    if (areGpuQueriesEqual(query, preset)) {
      return key;
    }
  }

  return null;
}

function areGpuQueriesEqual(query1: GpusQuery, query2: GpusQuery) {
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
