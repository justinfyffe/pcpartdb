import { parseISO } from 'date-fns';
import { ListOrder, ListSort } from '../../common';
import { getListGpusPath } from '../../routes';
import {
  ListProductsQuery,
  MarketSegment,
  Product,
  ProductionStatus,
  ProductType,
} from '../types';
import {
  getAffiliateUrl,
  hasProductFieldRawValue,
  productFieldRawValue,
} from '../utils';
import {
  DEFAULT_LIST_GPUS_LIMIT,
  DEFAULT_LIST_GPUS_OFFSET,
  DEFAULT_LIST_GPUS_ORDER,
  DEFAULT_LIST_GPUS_SORT,
  LIST_GPUS_PRESETS,
} from './consts';
import { GpuProduct, ListGpusPresetSlug } from './types';

export function isGpuProduct(product: Product): product is GpuProduct {
  return product.productType === ProductType.Gpu;
}

export function getGpuChipset(gpu: GpuProduct) {
  return (gpu?.parent || gpu) as GpuProduct;
}

export function getGpuAffiliateUrl(gpu: GpuProduct) {
  return getAffiliateUrl(gpu);
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
): ListProductsQuery {
  const offset = Number(query.offset ?? DEFAULT_LIST_GPUS_OFFSET);
  const limit = Number(query.limit ?? DEFAULT_LIST_GPUS_LIMIT);

  const company = (query.company as string)?.split(',');
  const segment = (query.segment as string)
    ?.toUpperCase()
    .split(',') as MarketSegment[];
  const sort = (query.sort as ListSort) || DEFAULT_LIST_GPUS_SORT;
  const order = (query.order as ListOrder) || DEFAULT_LIST_GPUS_ORDER;
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

export function isPastGpuLaunchDate(gpu: GpuProduct) {
  if (!hasProductFieldRawValue(gpu?.fields?.releaseDate)) {
    return false;
  }

  const date = new Date();
  const releaseDate = parseISO(productFieldRawValue(gpu?.fields.releaseDate));
  return date.getTime() >= releaseDate.getTime();
}

export function hasGpuLaunched(gpu: GpuProduct) {
  if (
    productFieldRawValue(gpu?.fields?.productionStatus) ===
      ProductionStatus.Unreleased ||
    !isPastGpuLaunchDate(gpu)
  ) {
    return false;
  }

  return true;
}
