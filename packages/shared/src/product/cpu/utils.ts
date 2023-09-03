import { parseISO } from 'date-fns';
import { getListCpusPath } from '../../routes';
import { ProductType } from '../types';
import { getAffiliateUrl, hasProductFieldValue } from '../utils';
import {
  DEFAULT_LIST_CPUS_LIMIT,
  DEFAULT_LIST_CPUS_OFFSET,
  DEFAULT_LIST_CPUS_ORDER,
  DEFAULT_LIST_CPUS_SORT,
  LIST_CPUS_PRESETS,
} from './consts';
import {
  Cpu,
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
  ListCpusOrder,
  ListCpusPresetSlug,
  ListCpusQuery,
  ListCpusSort,
} from './types';

export function generateCpuSlug(name: string, company: string) {
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

export function getCpuAffiliateUrl(cpu: Cpu) {
  return getAffiliateUrl(ProductType.Cpu, cpu);
}

export function generateListCpusQueryFromPath(path: string) {
  const presetRegex = getListCpusPath('([a-zA-Z0-9-_]+)');
  const matches = path.match(presetRegex);
  const preset = matches != null && matches.length > 1 ? matches[1] : null;

  const paramsString = path.includes('?')
    ? path.substring(path.indexOf('?'))
    : '';
  const params = new URLSearchParams(paramsString);
  if (preset != null) {
    params.set('preset', preset);
  }

  return generateListCpusQueryFromSearchParams(Object.fromEntries(params));
}

export function generateListCpusQueryFromSearchParams(
  query: Record<string, string | string[]>,
): ListCpusQuery {
  const offset = Number(query.offset ?? DEFAULT_LIST_CPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_CPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as CpuMarketSegmentValue[];
  const sort = (query.sort as ListCpusSort) || DEFAULT_LIST_CPUS_SORT;
  const order = (query.order as ListCpusOrder) || DEFAULT_LIST_CPUS_ORDER;
  const preset = query.preset as ListCpusPresetSlug;

  if (preset != null && LIST_CPUS_PRESETS[preset] != null) {
    return { ...LIST_CPUS_PRESETS[preset], pagination: { limit, offset } };
  } else {
    return {
      filter: { company, segment },
      orderBy: { sort, order },
      pagination: { offset, limit },
    };
  }
}

export function isPastCpuLaunchDate(cpu: Cpu) {
  if (!hasProductFieldValue(cpu?.releaseDate)) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(cpu.releaseDate?.value);
  return date.getTime() >= releaseDate.getTime();
}

export function hasCpuLaunched(cpu: Cpu) {
  if (
    cpu?.productionStatus?.value === CpuProductionStatusValue.Unreleased ||
    !isPastCpuLaunchDate(cpu)
  ) {
    return false;
  }

  return true;
}

export function populateCpuPerformanceScoreBenchmark(cpu: Cpu) {
  const performance = calculatePerformanceScore(cpu);
  if (performance != null) {
    cpu.performanceScore = {
      value: performance,
      meta: { fieldKey: 'performanceScore', autoUpdate: false },
    };
  }
}

export function populateCpuValueScoreBenchmark(cpu: Cpu) {
  const value = calculateValueScore(cpu);
  if (value != null) {
    cpu.valueScore = {
      value,
      meta: { fieldKey: 'valueScore', autoUpdate: false },
    };
  }
}

function calculatePerformanceScore(cpu: Cpu) {
  // Get inputs
  const cpuMarkMultiThread = cpu.cpuMarkMultiThread?.value;

  // Validate inputs
  if (cpuMarkMultiThread == null || typeof cpuMarkMultiThread !== 'number') {
    return null;
  }

  // Compute score
  return cpuMarkMultiThread;
}

function calculateValueScore(cpu: Cpu) {
  // Get inputs
  const performanceScore = cpu.performanceScore?.value;
  const launchPrice = cpu.launchPrice?.value;

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

export function convertToCpuMemoryChannelText(memoryChannel: number) {
  if (memoryChannel == null) {
    return null;
  }

  switch (memoryChannel) {
    case 1:
      return 'Single-channel';
    case 2:
      return 'Dual-channel';
    case 3:
      return 'Triple-channel';
    case 4:
      return 'Quad-channel';
    case 6:
      return 'Hexa-channel';
    case 8:
      return 'Octa-channel';
    case 12:
      return 'Twelve-channel';
    default:
      return null;
  }
}

export function convertToCpuMemoryChannelNumber(memoryChannel: string) {
  if (memoryChannel == null) {
    return null;
  }

  const lcValue = memoryChannel.toLowerCase();
  switch (lcValue) {
    case 'single-channel':
    case 'one-channel':
      return 1;
    case 'dual-channel':
    case 'two-channel':
      return 2;
    case 'triple-channel':
    case 'three-channel':
      return 3;
    case 'quad-channel':
    case 'four-channel':
      return 4;
    case 'six-channel':
    case 'hexa-channel':
      return 6;
    case 'octa-channel':
    case 'eight-channel':
      return 8;
    case 'twelve-channel':
      return 12;
    default:
      return null;
  }
}
