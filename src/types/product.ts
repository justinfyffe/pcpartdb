import { NormalizedSchema, schema } from 'normalizr';
import {
  GpuProductBenchmark,
  ProductBenchmark,
  productBenchmarkSchema,
} from './product-benchmark';
import { ProductMeta, productMetaSchema } from './product-meta';
import { GpuProductSpec, ProductSpec, productSpecSchema } from './product-spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Product<
  TSpec extends ProductSpec = ProductSpec,
  TBenchmark extends ProductBenchmark = ProductBenchmark,
> {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  meta?: ProductMeta[];
  specs?: TSpec[];
  benchmarks?: TBenchmark[];
}

export interface GpuProduct
  extends Product<GpuProductSpec, GpuProductBenchmark> {}

export interface ProductRequest {
  slug: string;
  type: ProductType;
  name: string;

  meta: ProductMeta[];
  specs: ProductSpec[];
  benchmarks: ProductBenchmark[];
}

interface ProductEntities {
  products: Record<string, Product>;
  meta: Record<string, ProductMeta>;
  specs: Record<string, ProductSpec>;
  benchmarks: Record<string, ProductBenchmark>;
}

export type ProductResponse = NormalizedSchema<ProductEntities, number>;
export type ProductsResponse = NormalizedSchema<ProductEntities, number[]>;

export const productSchema = new schema.Entity('products', {
  meta: [productMetaSchema],
  specs: [productSpecSchema],
  benchmarks: [productBenchmarkSchema],
});
