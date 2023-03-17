import {
  DEFAULT_LIST_GPUS_LIMIT,
  getListGpusPath,
  GpusQuery,
  LIST_GPUS_PRESETS,
} from '@pcpartdb/shared';

export function getListPath(presetOrQuery: GpusQuery | string) {
  if (typeof presetOrQuery === 'string') {
    return getListGpusPath(presetOrQuery);
  }

  const params = new URLSearchParams();
  const query = presetOrQuery;

  if (query.limit != null && query.limit !== DEFAULT_LIST_GPUS_LIMIT) {
    params.append('limit', `${query.limit}`);
  }

  if (query.offset != null && query.offset !== 0) {
    params.append('offset', `${query.offset}`);
  }

  // Check if the rest of the query is a preset or not.
  const preset = getPresetEquivalent(query);
  if (preset != null) {
    const q = params.toString();
    const urlQuery = q ? `?${q}` : '';
    return getListGpusPath(`${preset}${urlQuery}`);
  }

  if (query.filter?.company?.length > 0) {
    params.append('company', query.filter.company.join(','));
  }

  if (query.orderBy?.sort) {
    params.append('sort', query.orderBy.sort);
  }

  if (query.orderBy?.order) {
    params.append('order', query.orderBy.order);
  }

  const q = params.toString();
  return getListGpusPath(q ? `?${q}` : '');
}

function getPresetEquivalent(query: GpusQuery) {
  const presets = Object.entries(LIST_GPUS_PRESETS);

  for (const [key, preset] of presets) {
    if (areQueriesEqual(query, preset)) {
      return key;
    }
  }

  return null;
}

function areQueriesEqual(query1: GpusQuery, query2: GpusQuery) {
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
