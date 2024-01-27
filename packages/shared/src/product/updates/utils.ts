import { CanMergeAutoUpdateStrategy, deepmerge } from '../../utils';
import { Product } from '../common';
import { ProductField } from '../fields';

export function canAutoUpdateProductField(field: ProductField) {
  return field?.meta?.autoUpdate ?? true;
}

const KEYS_TO_SKIP = [
  'root.affiliateUrl',
  'root.company',
  'root.name',
  'root.otherNames',
  'root.searchText',
  'root.slug',
  'root.summary',

  'root.benchmarks',
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
