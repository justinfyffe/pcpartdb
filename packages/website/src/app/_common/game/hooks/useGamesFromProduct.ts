import { getGamesFromProducts, Product } from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useGamesFromProduct(product: Partial<Product>) {
  return useMemo(
    () => (product != null ? getGamesFromProducts([product]) : null),
    [product],
  );
}
