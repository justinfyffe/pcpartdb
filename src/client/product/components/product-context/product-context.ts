import { BenchmarkMap } from '@shared/benchmark';
import {
  getBenchmarkMap,
  getProductMetaMap,
  getReviewMap,
  getSpecMap,
  Product,
} from '@shared/product';
import { ProductMetaMap } from '@shared/product-meta';
import { ReviewMap } from '@shared/review';
import { SpecMap } from '@shared/spec';
import { createContext } from 'react';

interface ProductContextState {
  product: Product;
  specs: SpecMap;
  meta: ProductMetaMap;
  benchmarks: BenchmarkMap;
  reviews: ReviewMap;
}

export const ProductContext = createContext<ProductContextState>({
  product: null,
  specs: {},
  meta: {},
  benchmarks: {},
  reviews: {},
});

export function createProductContextState(product: Product) {
  return {
    product,
    specs: getSpecMap(product),
    meta: getProductMetaMap(product),
    benchmarks: getBenchmarkMap(product),
    reviews: getReviewMap(product),
  } as ProductContextState;
}
