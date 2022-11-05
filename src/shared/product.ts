import { Benchmark, BenchmarkMap, BenchmarkRequest } from './benchmark';
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
import { Review, ReviewMap, ReviewRequest } from './review';
import { Spec, SpecMap, SpecRequest } from './spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Product {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  specs?: Spec[];
  benchmarks?: Benchmark[];
  reviews?: Review[];

  meta?: ProductMeta[];
  images?: ProductImage[];
}

export interface ProductRequest {
  slug: string;

  type: ProductType;
  name: string;

  specs: SpecRequest[];
  benchmarks: BenchmarkRequest[];
  reviews: ReviewRequest[];

  meta: ProductMetaRequest[];
  images: ProductImageRequest[];
}

export function getSpecMap(product: Product) {
  const specs: SpecMap = {};
  product.specs.forEach((spec) => {
    specs[spec.key] = spec;
  });

  return specs;
}

export function getBenchmarkMap(product: Product) {
  const benchmarks: BenchmarkMap = {};
  product.benchmarks.forEach((benchmark) => {
    benchmarks[benchmark.key] = benchmark;
  });

  return benchmarks;
}

export function getReviewMap(product: Product) {
  const reviews: ReviewMap = {};
  product.reviews.forEach((review) => {
    reviews[review.key] = review;
  });

  return reviews;
}

export function getProductMetaMap(product: Product) {
  const meta: ProductMetaMap = {};
  product.meta.forEach((value) => {
    meta[value.key] = value;
  });

  return meta;
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
