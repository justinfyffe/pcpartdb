import { Benchmarks, BenchmarksRequest } from '../benchmark';
import { ProductImages, ProductImagesRequest } from '../product-image';
import { ProductMetas, ProductMetasRequest } from '../product-meta';
import { Reviews, ReviewsRequest } from '../review';
import { Specs, SpecsRequest } from '../spec';

export enum ProductType {
  CPU = 'CPU',
  GPU = 'GPU',
}

export enum ProductsSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance_rating',
  ValueRating = 'value_rating',
  ReleaseDate = 'release_date',
}

export interface ProductsFilter {
  performanceRated?: boolean;

  company?: string;
  architecture?: string;
  year?: number;
}

export interface Product {
  id?: number;
  slug: string;

  type: ProductType;
  name: string;

  specs?: Specs;
  metas?: ProductMetas;
  benchmarks?: Benchmarks;
  reviews?: Reviews;
  images?: ProductImages;
}

export type ProductComparison = [Product, Product];

export interface RelatedProducts {
  comparisons?: ProductComparison[];
  gpus?: Product[];
}

export interface ProductRequest {
  slug: string;

  type: ProductType;
  name: string;

  specs: SpecsRequest;
  metas: ProductMetasRequest;
  benchmarks: BenchmarksRequest;
  reviews: ReviewsRequest;
  images: ProductImagesRequest;
}

export interface ImportProductRequest {
  url: string;
}

export interface ImportProductResults {
  name?: string;
  specs?: Specs;
  metas?: ProductMetas;
  benchmarks?: Benchmarks;
  reviews?: Reviews;
}

export interface ListProductsRequest {
  type: ProductType;
  filter?: ProductsFilter;
  sort?: ProductsSort;
  offset?: number;
  limit?: number;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindProductRequest {
  id?: number;
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface FindComparisonRequest {
  slug?: string;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface RelatedProductsRequest {
  type: ProductType;
  seed?: Product | ProductComparison;
  prioritize?: ProductsSort;
  limit?: number;
}
