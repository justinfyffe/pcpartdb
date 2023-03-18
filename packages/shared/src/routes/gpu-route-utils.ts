import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  Gpu,
  GpusQuery,
  LIST_GPUS_PRESETS,
} from '../gpus';

export function getListGpusPath(presetOrQuery?: GpusQuery | string) {
  const basePath = '/gpus/list/';

  if (presetOrQuery == null) {
    return basePath;
  }

  if (typeof presetOrQuery === 'string') {
    return `${basePath}${presetOrQuery}/`;
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
    const urlQuery = q ? `?${q}` : '';
    return `${basePath}${preset}/${urlQuery}`;
  }

  const searchParams =
    query != null
      ? Object.fromEntries(generateSearchParamsFromGpusQuery(query))
      : {};

  const combinedParams = new URLSearchParams({
    ...paginationParams,
    ...searchParams,
  }).toString();

  const q = combinedParams ? `?${combinedParams}` : '';
  return `${basePath}${q}`;
}

export function getViewGpuPath(gpuOrSlug: Gpu | string) {
  const slug = typeof gpuOrSlug === 'string' ? gpuOrSlug : gpuOrSlug.slug;
  return `/gpus/view/${slug}/`;
}

export function getCompareGpusPath(slug: string) {
  return `/gpus/compare/${slug}/`;
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

  const q = combinedParams ? `?${combinedParams}` : '';
  return `${path}${q}`;
}

export function getAdminNewGpuPath() {
  return '/admin/gpus/new/';
}

export function getAdminEditGpuPath(gpuOrId: Gpu | number) {
  const id = typeof gpuOrId === 'number' ? gpuOrId : gpuOrId.id;
  return `/admin/gpus/${id}/`;
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

function generateSearchParamsFromGpusQuery(query: GpusQuery) {
  const params = new URLSearchParams();

  if (query.filter?.company?.length > 0) {
    params.append('company', query.filter.company.join(','));
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
  const company1 = query1.filter?.company ?? [];
  const company2 = query2.filter?.company ?? [];

  if (sort1 !== sort2) {
    return false;
  }

  if (!company1.every((company) => company2.includes(company))) {
    return false;
  }

  return true;
}
