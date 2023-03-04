import { GpusQuery } from '@pcpartdb/shared/gpus';
import { getListGpusPath } from '../../../shared/website';
import { LIST_PRESETS } from './types';

export function getListPath(presetOrQuery: GpusQuery | string) {
  if (typeof presetOrQuery === 'string') {
    return getListGpusPath(presetOrQuery);
  }

  const query = presetOrQuery;
  const preset = getPresetEquivalent(query);
  if (preset != null) {
    return getListGpusPath(preset);
  }

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

  const q = params.toString();
  return getListGpusPath(q ? `?${q}` : '');
}

function getPresetEquivalent(query: GpusQuery) {
  const presets = Object.entries(LIST_PRESETS);

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
