import { ListQuery, ListRequest, ListResponse } from '../common';
import { ProductSource } from './sources';
import {
  ListProductsQuery,
  Product,
  ProductType,
  ProductUpdate,
  ProductUpdateStatus,
  SubProductType,
} from './types';

// Products
export interface ListProductsRequest<
  TQuery extends ListProductsQuery = ListProductsQuery,
> extends ListRequest<TQuery> {
  productType: ProductType;
}

export interface ListProductsResponse<
  TQuery extends ListProductsQuery = ListProductsQuery,
  TResult extends Product = Product,
> extends ListResponse<TQuery, TResult> {
  productType: ProductType;
  additionalData?: unknown;
}

export interface AutocompleteProductsRequest {
  productType: ProductType;
  query?: string;
}

export interface AutocompleteProductsResponse {
  results: Product[];
}

export interface ScrapeProductRequest {
  productType: ProductType;
  sources: Partial<ProductSource>[];
}

export interface ScrapeProductResponse {
  product?: Partial<Product>;
}

export interface CreateProductRequest {
  product: Product;
}

export interface UpdateProductRequest {
  product: Product;
}

export interface GetProductRequest {
  includeAutomation?: boolean;
  includeBenchmarks?: boolean;
  includeChildren?: boolean;
  includeImages?: boolean;
  includeParent?: boolean;
  includeSources?: boolean;
  includeUpdates?: boolean;
}

// Product Updates

export interface ListProductUpdatesFilter {
  productType: ProductType;
  subProductType?: SubProductType;
  status?: ProductUpdateStatus;
  search?: string;
}

export interface ListProductUpdatesQuery
  extends ListQuery<ListProductUpdatesFilter> {}

export interface ListProductUpdatesRequest
  extends ListRequest<ListProductUpdatesQuery> {}

export interface ListProductUpdatesResponse
  extends ListResponse<ListProductUpdatesQuery, ProductUpdate> {}

export interface ApproveProductUpdateRequest {
  slug?: string;
}

export interface RejectProductUpdateRequest {}
