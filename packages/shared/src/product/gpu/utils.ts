import { parseISO } from 'date-fns';
import { getListGpusPath } from '../../routes';
import { ProductType } from '../types';
import { getAffiliateUrl, hasProductFieldValue } from '../utils';
import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_ORDER,
  DEFAULT_LIST_GPUS_SORT,
  LIST_GPUS_PRESETS,
} from './consts';
import {
  Gpu,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  ListGpusOrder,
  ListGpusPresetSlug,
  ListGpusQuery,
  ListGpusSort,
} from './types';

export function getGpuChipset(gpu: Gpu) {
  return gpu?.chipset || gpu;
}

export function getGpuAffiliateUrl(gpu: Gpu) {
  return getAffiliateUrl(ProductType.Gpu, gpu);
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

export function generateListGpusQueryFromPath(path: string) {
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

  return generateListGpusQueryFromSearchParams(Object.fromEntries(params));
}

export function generateListGpusQueryFromSearchParams(
  query: Record<string, string | string[]>,
): ListGpusQuery {
  const offset = Number(query.offset ?? DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as GpuMarketSegmentValue[];
  const sort = (query.sort as ListGpusSort) || DEFAULT_LIST_GPUS_SORT;
  const order = (query.order as ListGpusOrder) || DEFAULT_LIST_GPUS_ORDER;
  const preset = query.preset as ListGpusPresetSlug;

  if (preset != null && LIST_GPUS_PRESETS[preset] != null) {
    return { ...LIST_GPUS_PRESETS[preset], pagination: { limit, offset } };
  } else {
    return {
      filter: { company, segment },
      orderBy: { sort, order },
      pagination: { offset, limit },
    };
  }
}

export function isPastGpuLaunchDate(gpu: Gpu) {
  if (!hasProductFieldValue(gpu?.releaseDate)) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(gpu.releaseDate?.value);
  return date.getTime() >= releaseDate.getTime();
}

export function hasGpuLaunched(gpu: Gpu) {
  if (
    gpu?.productionStatus?.value === GpuProductionStatusValue.Unreleased ||
    !isPastGpuLaunchDate(gpu)
  ) {
    return false;
  }

  return true;
}

export function populateGpuPerformanceScoreBenchmark(gpu: Gpu) {
  const performance = calculatePerformanceScore(gpu);
  if (performance != null) {
    gpu.performanceScore = {
      value: performance,
      meta: { fieldKey: 'performanceScore', autoUpdate: false },
    };
  }
}

export function populateGpuValueScoreBenchmark(gpu: Gpu) {
  const value = calculateValueScore(gpu);
  if (value != null) {
    gpu.valueScore = {
      value,
      meta: { fieldKey: 'valueScore', autoUpdate: false },
    };
  }
}

function calculatePerformanceScore(gpu: Gpu) {
  // Get inputs
  const g3dMark = gpu.g3dMark?.value;

  // Validate inputs
  if (g3dMark == null || typeof g3dMark !== 'number') {
    return null;
  }

  // Compute score
  return g3dMark;
}

function calculateValueScore(gpu: Gpu) {
  // Get inputs
  const performanceScore = gpu.performanceScore?.value;
  const launchPrice = gpu.launchPrice?.value;

  // Validate inputs
  if (performanceScore == null) {
    return null;
  }
  if (launchPrice == null || typeof launchPrice !== 'number') {
    return null;
  }

  // Compute score
  return performanceScore / launchPrice;
}
