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

interface ProductsContextState {
  products: [Product, Product];
  specs: [SpecMap, SpecMap];
  meta: [ProductMetaMap, ProductMetaMap];
  benchmarks: [BenchmarkMap, BenchmarkMap];
  reviews: [ReviewMap, ReviewMap];
}

export const ProductsContext = createContext<ProductsContextState>({
  products: [null, null],
  specs: [null, null],
  meta: [null, null],
  benchmarks: [null, null],
  reviews: [null, null],
});

export function createProductsContextState(products: [Product, Product]) {
  return {
    products,
    specs: [getSpecMap(products[0]), getSpecMap(products[1])],
    meta: [getProductMetaMap(products[0]), getProductMetaMap(products[1])],
    benchmarks: [getBenchmarkMap(products[0]), getBenchmarkMap(products[1])],
    reviews: [getReviewMap(products[0]), getReviewMap(products[1])],
  } as ProductsContextState;
}
