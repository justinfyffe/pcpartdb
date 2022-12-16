import { Benchmarks } from '@shared/benchmark';
import { ProductComparison } from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Reviews } from '@shared/review';
import { Specs } from '@shared/spec';
import { createContext } from 'react';

interface ProductsContextState {
  comparison: ProductComparison;
  specs: [Specs, Specs];
  meta: [ProductMetas, ProductMetas];
  benchmarks: [Benchmarks, Benchmarks];
  reviews: [Reviews, Reviews];
}

export const ProductsContext = createContext<ProductsContextState>({
  comparison: [null, null],
  specs: [null, null],
  meta: [null, null],
  benchmarks: [null, null],
  reviews: [null, null],
});

export function createProductsContextState(products: ProductComparison) {
  const comparison = { ...products };
  return {
    comparison,
    specs: [comparison[0].specs, comparison[1].specs],
    meta: [comparison[0].metas, comparison[1].metas],
    benchmarks: [comparison[0].benchmarks, comparison[1].benchmarks],
    reviews: [comparison[0].reviews, comparison[1].reviews],
  } as ProductsContextState;
}
