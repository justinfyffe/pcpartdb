import { ListRequest, ListResponse } from '../common';
import { BenchmarkKey } from './benchmarks';
import { CpuProduct, GpuProduct, Product, ProductType } from './common';
import {
  ListCpusAdditionalData,
  ListCpusQuery,
  ListGpusAdditionalData,
  ListGpusQuery,
  ListProductsQuery,
} from './lists';
import { ProductSource } from './sources';

//
// List Products Request
//

export interface ListProductsRequest<
  TQuery extends ListProductsQuery = ListProductsQuery,
> extends ListRequest<TQuery> {
  bypassCache?: boolean;
}

export interface ListProductsResponse<
  TQuery extends ListProductsQuery = ListProductsQuery,
  TResult extends Product = Product,
> extends ListResponse<TQuery, TResult> {
  additionalData?: unknown;
}

export interface ListCpusRequest extends ListProductsRequest<ListCpusQuery> {}

export interface ListCpusResponse
  extends ListProductsResponse<ListCpusQuery, CpuProduct> {
  additionalData?: ListCpusAdditionalData;
}

export interface ListGpusRequest extends ListProductsRequest<ListGpusQuery> {}

export interface ListGpusResponse
  extends ListProductsResponse<ListGpusQuery, GpuProduct> {
  additionalData: ListGpusAdditionalData;
}

//
// Get Product Request
//

export interface GetProductRequest {
  includeAutomation?: boolean;
  includeBenchmarks?: boolean;
  includeFields?: boolean;
  includeGames?: boolean;
  includeImages?: boolean;
  includeParent?: boolean;
  includeRanks?: boolean;
  includeSources?: boolean;
  includeUpdates?: boolean;

  bypassCache?: boolean;
}
export type GetProductResponse = Product;

//
// Get Relative Data Products Request
//

export interface GetRelativeDataProductsRequest {
  // Data to help fetch updated content for website.
  productIds?: number[]; // 1 for view, multiple for compare

  benchmark?: BenchmarkKey;
  game?: number | string; // Game ID or URL slug of game

  total?: number;

  bypassCache?: boolean;
}

//
// Create Product Request
//

export interface CreateProductRequest {
  product: Product;
}

//
// Update Product Request
//

export interface UpdateProductRequest {
  product: Product;
}

//
// Autocomplete Products Request
//

export interface AutocompleteProductsRequest {
  productType: ProductType;
  query?: string;
}

export interface AutocompleteProductsResponse {
  results: Product[];
}

//
// Scrape Product Request
//

export interface ScrapeProductRequest {
  productType: ProductType;
  sources: Partial<ProductSource>[];
}

export interface ScrapeProductResponse {
  product?: Partial<Product>;
}
