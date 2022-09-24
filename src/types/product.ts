import { NormalizedSchema, schema } from 'normalizr';
import {
  ProductBenchmark,
  ProductBenchmarkRequest,
  productBenchmarkSchema,
} from './product-benchmark';
import {
  ProductImage,
  ProductImageRequest,
  productImageSchema,
} from './product-image';
import {
  ProductMeta,
  ProductMetaRequest,
  productMetaSchema,
} from './product-meta';
import {
  ProductReview,
  ProductReviewRequest,
  productReviewSchema,
} from './product-review';
import {
  ProductSpec,
  ProductSpecRequest,
  productSpecSchema,
} from './product-spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export enum ProductPropertyType {
  Meta = 'meta',
  Spec = 'spec',
}

export interface Product {
  id?: number;
  slug: string;
  parentId?: number;

  type: ProductType;
  name: string;

  parent?: Product;
  meta?: ProductMeta[];
  specs?: ProductSpec[];
  benchmarks?: ProductBenchmark[];
  reviews?: ProductReview[];
  images?: ProductImage[];
}

export interface ProductRequest {
  parentId?: number;
  slug: string;

  type: ProductType;
  name: string;

  meta: ProductMetaRequest[];
  specs: ProductSpecRequest[];
  benchmarks: ProductBenchmarkRequest[];
  reviews: ProductReviewRequest[];
  images: ProductImageRequest[];
}

interface ProductEntities {
  products: Record<string, Product>;
  meta: Record<string, ProductMeta>;
  specs: Record<string, ProductSpec>;
  benchmarks: Record<string, ProductBenchmark>;
  reviews: Record<string, ProductReview>;
  images: Record<string, ProductImage>;
}

export type ProductResponse = NormalizedSchema<ProductEntities, number>;
export type ProductsResponse = NormalizedSchema<ProductEntities, number[]>;

export const productSchema = new schema.Entity('products', {
  meta: [productMetaSchema],
  specs: [productSpecSchema],
  benchmarks: [productBenchmarkSchema],
  reviews: [productReviewSchema],
  images: [productImageSchema],
});
