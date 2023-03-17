import { getListGpusPath } from '../website';
import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_SORT,
  LIST_GPUS_PRESETS,
  ListGpusPresetSlug,
} from './gpu-consts';
import { GpuOrder, GpuSort } from './gpu-types';

export function generateGpuSlug(name: string, company: string) {
  const slugParts = [];
  if (company != null) {
    const companyParts = company.split(' ').map((value) => value.toLowerCase());
    slugParts.push(...companyParts);
  }
  if (name != null) {
    const nameParts = name.split(' ').map((value) => value.toLowerCase());
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}

export function generateGpusQueryFromPath(path: string) {
  const presetRegex = getListGpusPath('[a-zA-Z0-9-_]+');
  const matches = path.match(presetRegex);
  const preset = matches != null && matches.length > 1 ? matches[1] : null;

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);
  if (preset != null) {
    params.set('preset', preset);
  }

  return generateGpusQueryFromSearchParams(Object.fromEntries(params));
}

export function generateGpusQueryFromSearchParams(
  query: Record<string, string | string[]>,
) {
  const offset = Number(query.offset ?? DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const sort = (query.sort as GpuSort) || DEFAULT_LIST_GPUS_SORT;
  const order = query.order as GpuOrder;
  const preset = query.preset as ListGpusPresetSlug;

  if (preset != null && LIST_GPUS_PRESETS[preset] != null) {
    return { ...LIST_GPUS_PRESETS[preset], limit, offset };
  } else {
    return {
      filter: { company },
      orderBy: { sort, order },
      offset,
      limit,
    };
  }
}
