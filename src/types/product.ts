import { NormalizedSchema, schema } from 'normalizr';
import { ProductBenchmark, ProductBenchmarkRequest } from './product-benchmark';
import { ProductImage, ProductImageRequest } from './product-image';
import { ProductMeta, ProductMetaRequest } from './product-meta';
import { ProductReview, ProductReviewRequest } from './product-review';
import { ProductSpec, ProductSpecRequest } from './product-spec';

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
  slug: string;
  parentId?: number;

  type: ProductType;
  name: string;

  meta: ProductMetaRequest[];
  specs: ProductSpecRequest[];
  benchmarks: ProductBenchmarkRequest[];
  reviews: ProductReviewRequest[];
  images: ProductImageRequest[];
}

export function getProductMeta(product: Product) {
  const meta: Record<string, ProductMeta> = {};
  product.meta.forEach((value) => {
    meta[value.key] = value;
  });

  return meta;
}

export function getProductSpecs(product: Product) {
  const specs: Record<string, ProductSpec> = {};
  product.specs.forEach((spec) => {
    specs[spec.key] = spec;
  });

  return specs;
}

export function getProductBenchmarks(product: Product) {
  const benchmarks: Record<string, ProductBenchmark> = {};
  product.benchmarks.forEach((benchmark) => {
    benchmarks[benchmark.key] = benchmark;
  });

  return benchmarks;
}

export function getOrderedBenchmarks(product: Product) {
  const benchmarks =
    product.benchmarks?.filter(
      (benchmark) => benchmark.metadata?.order != null,
    ) ?? [];

  return benchmarks.sort((a, b) => a.metadata.order - b.metadata.order);
}

export function getProductReviews(product: Product) {
  const reviews: Record<string, ProductReview> = {};
  product.reviews.forEach((review) => {
    reviews[review.key] = review;
  });

  return reviews;
}

export function getOrderedReviews(product: Product) {
  const reviews =
    product.reviews?.filter((benchmark) => benchmark.metadata?.order != null) ??
    [];

  return reviews.sort((a, b) => a.metadata.order - b.metadata.order);
}
