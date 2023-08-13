import {
  Cpu,
  CpuComparison,
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  LIST_CPUS_PRESETS,
  ListCpusQuery,
} from '../product';
import { joinUrlParts } from '../utils';
import { GetCompareProductsPathOptions } from './product-route-utils';

export function getAdminNewCpuPath() {
  return '/admin/cpus/new/';
}

export function getAdminEditCpuPath(cpuOrId: Cpu | number) {
  const id = typeof cpuOrId === 'number' ? cpuOrId : cpuOrId.id;
  return joinUrlParts('/admin/cpus/', String(id), '/');
}

export function getAdminListCpusPath(query?: ListCpusQuery) {
  const path = '/admin/cpus/';

  const paginationParams =
    query != null
      ? Object.fromEntries(generatePaginationParamsFromCpusQuery(query))
      : {};
  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromCpusQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  return joinUrlParts(path, combinedParams ? `?${combinedParams}` : '');
}

export function getListCpusPath(presetOrQuery?: ListCpusQuery | string) {
  const basePath = '/cpus/list/';

  if (presetOrQuery == null) {
    return basePath;
  }

  if (typeof presetOrQuery === 'string') {
    return joinUrlParts(basePath, presetOrQuery, '/');
  }

  const query = presetOrQuery;
  const paginationParams =
    query != null
      ? Object.fromEntries(generatePaginationParamsFromCpusQuery(query))
      : {};

  // Check if the rest of the query is a preset or not.
  const preset = getListCpusPresetEquivalent(query);
  if (preset != null) {
    const q = new URLSearchParams(paginationParams).toString();
    return joinUrlParts(basePath, preset, q ? `?${q}` : '');
  }

  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromCpusQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  return joinUrlParts(basePath, combinedParams ? `?${combinedParams}` : '');
}

export function getViewCpuPath(cpuOrSlug: Cpu | string) {
  if (cpuOrSlug == null) {
    return null;
  }

  const slug = typeof cpuOrSlug === 'string' ? cpuOrSlug : cpuOrSlug.slug;
  return joinUrlParts('/cpus/view/', slug, '/');
}

export function getCompareCpusPath(
  comparisonOrSlug: CpuComparison | [string, string],
  options?: GetCompareProductsPathOptions,
) {
  let cpu1Slug: string;
  let cpu2Slug: string;
  if (typeof comparisonOrSlug[0] === 'string') {
    cpu1Slug = comparisonOrSlug[0];
    cpu2Slug = comparisonOrSlug[1] as string;
  } else {
    const comparison = comparisonOrSlug as CpuComparison;
    const [cpu1, cpu2] =
      options?.ordered === true
        ? [...comparison].sort((p1, p2) => p1.id - p2.id)
        : comparison;
    cpu1Slug = cpu1.slug;
    cpu2Slug = cpu2.slug;
  }

  return joinUrlParts('/cpus/compare/', `${cpu1Slug}--vs--${cpu2Slug}`, '/');
}

export function getAdminImportCpusPath() {
  return '/admin/cpus/import';
}

function generatePaginationParamsFromCpusQuery(query: ListCpusQuery) {
  const params = new URLSearchParams();

  if (
    query?.pagination?.limit != null &&
    query.pagination.limit !== DEFAULT_LIST_CPUS_LIMIT
  ) {
    params.append('limit', `${query.pagination.limit}`);
  }

  if (
    query?.pagination?.offset != null &&
    query.pagination.offset !== DEFAULT_LIST_CPUS_OFFSET
  ) {
    params.append('offset', `${query.pagination.offset}`);
  }

  return params;
}

function generateSearchParamsFromCpusQuery(query: ListCpusQuery) {
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

function getListCpusPresetEquivalent(query: ListCpusQuery) {
  const presets = Object.entries(LIST_CPUS_PRESETS);

  for (const [key, preset] of presets) {
    if (areCpuQueriesEqual(query, preset)) {
      return key;
    }
  }

  return null;
}

function areCpuQueriesEqual(query1: ListCpusQuery, query2: ListCpusQuery) {
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
