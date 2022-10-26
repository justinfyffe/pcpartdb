import {
  getBenchmarkMap,
  getProductMetaMap,
  getReviewMap,
  getSpecMap,
  Product,
} from '@shared/product';
import { ProductBenchmarkMap } from '@shared/product-benchmark';
import { ProductMetaMap } from '@shared/product-meta';
import { ProductReviewMap } from '@shared/product-review';
import { ProductSpecMap } from '@shared/product-spec';
import { createContext } from 'react';

interface ProductContextState {
  product: Product;
  specs: ProductSpecMap;
  meta: ProductMetaMap;
  benchmarks: ProductBenchmarkMap;
  reviews: ProductReviewMap;
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
