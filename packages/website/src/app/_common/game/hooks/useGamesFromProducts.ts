import { getGamesFromProducts, Product } from '@pcpartdb/shared';
import { useMemo } from 'react';

export function useGamesFromProducts(products: Partial<Product>[]) {
  return useMemo(() => getGamesFromProducts(products), [products]);
}
