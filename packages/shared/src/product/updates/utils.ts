import { deepmerge } from '../../utils';
import { Product } from '../common';
import { isProductField, ProductField } from '../fields';

export function canAutoUpdateProductField(field: ProductField) {
  return field?.meta?.autoUpdate ?? true;
}

const KEYS_TO_SKIP = [
  'root.name',
  'root.slug',
  'root.company',
  'root.otherNames',
  'root.searchText',
  'root.affiliateUrl',

  'root.summary',
  'root.summaryPublishedAt',
  'root.summaryStale',

  'root.viewable',

  'root.metadata',
  'root.automatedAt',

  'root.benchmarks',
  'root.games',
  'root.images',
  'root.sources',
];
export function mergeProducts(original: Product, updated: Product): Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canMergeStrategy = (key: string, source: any, obj: any) => {
    if (KEYS_TO_SKIP.includes(key)) {
      return false;
    }

    return CanMergeAutoUpdateStrategy(key, source, obj);
  };

  return deepmerge({ canMergeStrategy }, original, updated);
}

export function CanMergeAutoUpdateStrategy(
  _key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
) {
  if (obj === undefined) {
    return false;
  }

  if (
    isProductField(source) &&
    source?.meta?.autoUpdate != null &&
    source.meta.autoUpdate === false
  ) {
    return false;
  }

  return true;
}
