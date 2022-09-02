import { NormalizedSchema, schema } from 'normalizr';
import { ProductBenchmark, productBenchmarkSchema } from './product-benchmark';
import { ProductMeta, productMetaSchema } from './product-meta';
import { ProductReview, productReviewSchema } from './product-review';
import { GpuProductSpec, ProductSpec, productSpecSchema } from './product-spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export enum ProductPropertyType {
  Meta = 'meta',
  Spec = 'spec',
}

export interface Product<TSpec extends ProductSpec = ProductSpec> {
  id?: number;
  slug: string;
  parentId?: number;

  type: ProductType;
  name: string;

  product?: Product;
  meta?: ProductMeta[];
  specs?: TSpec[];
  benchmarks?: ProductBenchmark[];
  reviews?: ProductReview[];
}

export interface GpuProduct extends Product<GpuProductSpec> {}

export interface ProductRequest {
  parentId?: number;
  slug: string;

  type: ProductType;
  name: string;

  meta: ProductMeta[];
  specs: ProductSpec[];
  benchmarks: ProductBenchmark[];
  reviews: ProductReview[];
}

interface ProductEntities {
  products: Record<string, Product>;
  meta: Record<string, ProductMeta>;
  specs: Record<string, ProductSpec>;
  benchmarks: Record<string, ProductBenchmark>;
  reviews: Record<string, ProductReview>;
}

export type ProductResponse = NormalizedSchema<ProductEntities, number>;
export type ProductsResponse = NormalizedSchema<ProductEntities, number[]>;

export const productSchema = new schema.Entity('products', {
  meta: [productMetaSchema],
  specs: [productSpecSchema],
  benchmarks: [productBenchmarkSchema],
  reviews: [productReviewSchema],
});
