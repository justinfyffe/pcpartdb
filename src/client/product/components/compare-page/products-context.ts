import { Benchmarks } from '@shared/benchmark';
import { Product } from '@shared/product';
import { ProductMetas } from '@shared/product-meta';
import { Reviews } from '@shared/review';
import { Specs } from '@shared/spec';
import { createContext } from 'react';

interface ProductsContextState {
  products: [Product, Product];
  specs: [Specs, Specs];
  meta: [ProductMetas, ProductMetas];
  benchmarks: [Benchmarks, Benchmarks];
  reviews: [Reviews, Reviews];
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
    specs: [products[0].specs, products[1].specs],
    meta: [products[0].metas, products[1].metas],
    benchmarks: [products[0].benchmarks, products[1].benchmarks],
    reviews: [products[0].reviews, products[1].reviews],
  } as ProductsContextState;
}
