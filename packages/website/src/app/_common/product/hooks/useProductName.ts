import {
  formatProductName,
  FormatProductNameOptions,
  Product,
} from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useProductName(
  product: Partial<Product>,
  options?: FormatProductNameOptions,
) {
  return useMemo(() => formatProductName(product, options), [options, product]);
}
