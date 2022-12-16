import { Benchmarks } from '@shared/benchmark';
import { Product } from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Reviews } from '@shared/review';
import { Specs } from '@shared/spec';
import { createContext } from 'react';

interface ProductContextState {
  product: Product;
  specs: Specs;
  metas: ProductMetas;
  benchmarks: Benchmarks;
  reviews: Reviews;
}

export const ProductContext = createContext<ProductContextState>({
  product: null,
  specs: {},
  metas: {},
  benchmarks: {},
  reviews: {},
});

export function createProductContextState(input: Product) {
  const product = { ...input };

  return {
    product,
    specs: product.specs,
    metas: product.metas,
    benchmarks: product.benchmarks,
    reviews: product.reviews,
  } as ProductContextState;
}
