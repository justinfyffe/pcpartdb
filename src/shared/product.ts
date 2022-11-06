import { Benchmarks, BenchmarksRequest } from './benchmark';
import { ProductImages, ProductImagesRequest } from './product-image';
import { ProductMetas, ProductMetasRequest } from './product-meta';
import { Reviews, ReviewsRequest } from './review';
import { Specs, SpecsRequest } from './spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export interface Product {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  specs?: Specs;
  benchmarks?: Benchmarks;
  reviews?: Reviews;

  metas?: ProductMetas;
  images?: ProductImages;
}

export interface ProductRequest {
  slug: string;

  type: ProductType;
  name: string;

  specs: SpecsRequest;
  benchmarks: BenchmarksRequest;
  reviews: ReviewsRequest;

  metas: ProductMetasRequest;
  images: ProductImagesRequest;
}
