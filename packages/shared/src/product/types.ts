import { MeasurementUnit } from '../common';
import { DateFormat } from '../format';
import { Cpu, CpuDataSource, CpuFieldKey, CpuImage, CpuImages } from './cpu';
import { Gpu, GpuDataSource, GpuFieldKey, GpuImage, GpuImages } from './gpu';

export enum ProductType {
  Cpu = 'CPU',
  Gpu = 'GPU',
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

export interface ScrapeProductRequest {
  sources: Record<string, ProductDataSource>;
}

export interface ScrapeProductResponse {
  product?: Partial<Product>;
}

export interface ProductDiff {
  original?: Product;
  updated?: Product;
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
