import { MeasurementUnit } from '../common';
import { DateFormat } from '../format';
import {
  Cpu,
  CpuDataSource,
  CpuDataSourceKey,
  CpuFieldKey,
  CpuImage,
  CpuImages,
  CpuProductSource,
  CpuProductSourceGroup,
  CpuUpdate,
} from './cpu';
import {
  Gpu,
  GpuDataSource,
  GpuDataSourceKey,
  GpuFieldKey,
  GpuImage,
  GpuImages,
  GpuProductSource,
  GpuProductSourceGroup,
  GpuUpdate,
} from './gpu';

export enum ProductType {
  Cpu = 'CPU',
  Gpu = 'GPU',
}

export enum ProductUpdateStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
}

export type Product = Cpu | Gpu;
export type ProductComparison = [Product, Product];

export type ProductFieldKey = CpuFieldKey | GpuFieldKey;

export interface ProductFieldMeta {
  fieldKey?: ProductFieldKey;
  currency?: string;
  unit?: MeasurementUnit;
  dateFormat?: DateFormat;
  autoUpdate?: boolean;
}

export interface ProductField<T = unknown> {
  value?: T;
  meta?: ProductFieldMeta;
}

export type ProductImage = CpuImage | GpuImage;
export type ProductImages = CpuImages | GpuImages;

export type ProductDataSource = CpuDataSource | GpuDataSource;
export type ProductSourceKey = CpuDataSourceKey | GpuDataSourceKey;

export interface ProductDiff<TProduct = Product> {
  original?: TProduct;
  updated?: TProduct;
}

/**
 * Data structure containing information regarding a single source for a
 * product.
 */
export interface BaseProductSource {
  id?: number;

  groupKey: string;
  productType: ProductType;
  sourceKey: ProductSourceKey;
  externalKey: string;

  sourceName: string;
  sourceUrl: string;

  archived?: boolean;
}
export type ProductSource = CpuProductSource | GpuProductSource;

/**
 * Group of product sources, usually grouped by source name.
 */
export type ProductSourceGroup = CpuProductSourceGroup | GpuProductSourceGroup;

/**
 * Data structure containing information regarding data updates for a
 * product. This could include a new or existing product.
 */
export interface BaseProductUpdate<T = unknown> {
  id?: number;

  productType: ProductType;
  productName: string;

  status: ProductUpdateStatus;
  description?: string;

  data?: T;
  metadata?: ProductUpdateMeta;
}
export type ProductUpdate = CpuUpdate | GpuUpdate;

export interface ProductUpdateMeta {}

export interface ScrapeProductRequest {
  sources: Record<string, ProductDataSource>;
}

export interface ScrapeProductResponse {
  product?: Partial<Product>;
}

export interface PreviewImportProductsRequest {
  file?: File;
  tempPath?: string;
}

export interface PreviewImportProductsResponse {
  diffs: ProductDiff[];
}

export interface ImportProductsRequest {
  products: Product[];
}

export interface UpsertProductSourcesRequest {
  sources: ProductSource[];
}

export type CreateProductUpdateRequest = ProductUpdate;

export interface AutocompleteProductSourcesRequest {
  productType: ProductType;
  source?: ProductSourceKey;
  query?: string;
}

export interface AutocompleteProductSourcesResponse {
  sources: ProductSource[];
}

export interface ApplyProductSourcesToProductRequest {
  productType: ProductType;
  productId: number;
  sources: number[];
}
