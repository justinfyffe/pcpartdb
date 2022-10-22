import {
  ProductBenchmark,
  ProductBenchmarkMap,
  ProductBenchmarkRequest,
} from './product-benchmark';
import {
  ProductImage,
  ProductImageMap,
  ProductImageRequest,
  ProductImageType,
} from './product-image';
import {
  ProductMeta,
  ProductMetaMap,
  ProductMetaRequest,
} from './product-meta';
import {
  ProductReview,
  ProductReviewMap,
  ProductReviewRequest,
} from './product-review';
import {
  ProductSpec,
  ProductSpecMap,
  ProductSpecRequest,
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

  type: ProductType;
  name: string;

  meta?: ProductMeta[];
  specs?: ProductSpec[];
  benchmarks?: ProductBenchmark[];
  reviews?: ProductReview[];
  images?: ProductImage[];
}

export interface ProductRequest {
  slug: string;

  type: ProductType;
  name: string;

  meta: ProductMetaRequest[];
  specs: ProductSpecRequest[];
  benchmarks: ProductBenchmarkRequest[];
  reviews: ProductReviewRequest[];
  images: ProductImageRequest[];
}

export function getProductMetaMap(product: Product) {
  const meta: ProductMetaMap = {};
  product.meta.forEach((value) => {
    meta[value.key] = value;
  });

  return meta;
}

export function getProductSpecMap(product: Product) {
  const specs: ProductSpecMap = {};
  product.specs.forEach((spec) => {
    specs[spec.key] = spec;
  });

  return specs;
}

export function getProductBenchmarkMap(product: Product) {
  const benchmarks: ProductBenchmarkMap = {};
  product.benchmarks.forEach((benchmark) => {
    benchmarks[benchmark.key] = benchmark;
  });

  return benchmarks;
}

export function getProductReviewMap(product: Product) {
  const reviews: ProductReviewMap = {};
  product.reviews.forEach((review) => {
    reviews[review.key] = review;
  });

  return reviews;
}

export function getProductImageMap(product: Product) {
  const images: ProductImageMap = {};

  product.images?.forEach((image) => {
    images[image.type] = images[image.type] ?? [];
    images[image.type].push(image);
  });

  // Details has a metadata with order
  images[ProductImageType.Details]?.sort(
    (image1, image2) => image1.metadata.order - image2.metadata.order,
  );

  return images;
}
