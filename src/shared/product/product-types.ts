import { Benchmarks, BenchmarksRequest } from '../benchmark';
import { ProductImages, ProductImagesRequest } from '../product-image';
import { ProductMetas, ProductMetasRequest } from '../product-meta';
import { Specs, SpecsRequest } from '../spec';

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
  metas?: ProductMetas;
  benchmarks?: Benchmarks;
  images?: ProductImages;
}

export interface ProductRequest {
  slug: string;

  type: ProductType;
  name: string;

  specs: SpecsRequest;
  metas: ProductMetasRequest;
  benchmarks: BenchmarksRequest;
  images: ProductImagesRequest;
}

export type ProductComparison = [Product, Product];

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

export interface RelatedProducts {
  gpus?: Product[];
  comparisons?: ProductComparison[];
}

export interface RelatedProductsRequest {
  type: ProductType;
  seed?: Product | ProductComparison;
  prioritize?: ProductsSort;
  limit?: number;
}

export enum ProductsSort {
  Id = 'id',
  Name = 'name',
  PerformanceRating = 'performance-rating',
  ValueRating = 'value-rating',
  ReleaseDate = 'release-date',
}

export enum ProductsOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export interface ProductsFilter {
  company?: string[];
  architecture?: string[];
  year?: number[];

  performanceRated?: boolean;
  valueRated?: boolean;
}

export interface ProductsOrderBy {
  sort: ProductsSort;
  order?: ProductsOrder;
}

export interface ProductsQuery {
  filter?: ProductsFilter;
  orderBy?: ProductsOrderBy;
}

export interface ListProductsRequest {
  type: ProductType;
  query?: ProductsQuery;

  includeRanks?: boolean;
  includeImages?: boolean;
}

export interface ImportProductRequest {
  url: string;
}

export interface ImportProductResults {
  name?: string;
  specs?: Specs;
  metas?: ProductMetas;
  benchmarks?: Benchmarks;
}
