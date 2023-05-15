import { parseISO } from 'date-fns';
import { getListGpusPath } from '../routes';
import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_ORDER,
  DEFAULT_LIST_GPUS_SORT,
  LIST_GPUS_PRESETS,
  ListGpusPresetSlug,
} from './gpu-consts';
import { Gpu, GpuOrder, GpuSort, MarketSegmentValue } from './gpu-types';

export function getChipset(gpu: Gpu) {
  return gpu?.chipset || gpu;
}

export function generateGpuSlug(name: string, company: string) {
  const slugParts = [];
  if (company != null) {
    const companyParts = company
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...companyParts);
  }
  if (name != null) {
    const nameParts = name
      .replaceAll('+', ' plus ')
      .replaceAll(/[^a-zA-Z0-9-_]+/g, ' ')
      .split(' ')
      .map((value) => value.toLowerCase().trim())
      .filter((value) => value.length > 0);
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}

export function generateGpusQueryFromPath(path: string) {
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

  return generateGpusQueryFromSearchParams(Object.fromEntries(params));
}

export function generateGpusQueryFromSearchParams(
  query: Record<string, string | string[]>,
) {
  const offset = Number(query.offset ?? DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as MarketSegmentValue[];
  const sort = (query.sort as GpuSort) || DEFAULT_LIST_GPUS_SORT;
  const order = (query.order as GpuOrder) || DEFAULT_LIST_GPUS_ORDER;
  const preset = query.preset as ListGpusPresetSlug;

  if (preset != null && LIST_GPUS_PRESETS[preset] != null) {
    return { ...LIST_GPUS_PRESETS[preset], limit, offset };
  } else {
    return {
      filter: { company, segment },
      orderBy: { sort, order },
      offset,
      limit,
    };
  }
}

export function hasGpuLaunched(gpu: Gpu) {
  if (gpu?.releaseDate?.value == null) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(gpu.releaseDate?.value);
  return date.getTime() >= releaseDate.getTime();
}
