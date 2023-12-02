import { AutomationSource } from '../automation';
import { ListQuery } from '../common';
import { ProductBenchmark } from './benchmarks';
import { CpuFieldKey, CpuFields, ListCpusFilter } from './cpu';
import { GpuFieldKey, GpuFields, ListGpusFilter } from './gpu';
import { ProductImage } from './images';
import { ProductRank } from './ranks';
import { RelatedProduct } from './related';
import { ProductSource } from './sources';

export enum ProductType {
  Cpu = 'CPU',
  Gpu = 'GPU',
}

export enum SubProductType {
  GpuChipset = 'GPU_CHIPSET',
  GpuRetailModel = 'GPU_RETAIL_MODEL',
}

export enum ProductUpdateStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Approved = 'APPROVED',
}

export interface ProductMeta {}

export interface Product {
  id?: number;
  parentId?: number;

  productType: ProductType;
  slug: string;
  name: string;
  otherNames: string[];
  company?: string;
  searchText: string;
  affiliateUrl?: string;
  summary?: string;

  metadata?: ProductMeta;

  automatedAt?: number;

  fields?: ProductFields;
  benchmarks?: ProductBenchmark[];
  ranks?: ProductRank[];
  sources?: ProductSource[];
  updates?: ProductUpdate[];
  images?: ProductImage[];
  relatedProducts?: RelatedProduct[];
  relatedAutomationSources?: AutomationSource[];
  parent?: Product;
  children?: Product[];
}

export type ProductComparison = [Product, Product];

export type ProductFieldKey = CpuFieldKey | GpuFieldKey;
export type ProductFields = CpuFields | GpuFields;

export interface ProductFieldMeta {
  formattedValue?: string;
  autoUpdate?: boolean;
  fieldKey?: ProductFieldKey;
  fieldLabel?: string;
}

export interface ProductField<T = unknown> {
  value?: T;
  meta?: ProductFieldMeta;
}

export interface ProductDiff {
  original?: Product;
  updated?: Product;
}

/**
 * Data structure containing information regarding data updates for a
 * product. This could include a new or existing product.
 */
export interface ProductUpdate<T = ProductDiff> {
  id?: number;

  productType: ProductType;
  subProductType?: SubProductType;
  productName: string;

  status: ProductUpdateStatus;
  description?: string;

  data?: T;
  metadata?: ProductUpdateMeta;

  productId?: number;

  startedAt?: number;
  finishedAt?: number;
}
// export type ProductUpdate = CpuUpdate | GpuUpdate;

export interface ProductUpdateMeta {}

export type CreateProductUpdateRequest = ProductUpdate;

export interface ApplyAutomationSourcesToProductRequest {
  productType: ProductType;
  productId: number;
  sources: number[];
}

export enum MarketSegment {
  Desktop = 'DESKTOP',
  Embedded = 'EMBEDDED',
  Integrated = 'INTEGRATED',
  Mobile = 'MOBILE',
  Server = 'SERVER',
  Workstation = 'WORKSTATION',
}

export enum ProductionStatus {
  Active = 'ACTIVE',
  EndOfLife = 'END_OF_LIFE',
  Unreleased = 'UNRELEASED',
}

export type ListProductsFilter = ListCpusFilter | ListGpusFilter;
export interface ListProductsQuery extends ListQuery<ListProductsFilter> {}

export interface RelatedProducts {
  products: Product[];
}

export interface RelatedProductComparisons {
  comparisons: ProductComparison[];
}

export interface ProductScoreCalculations {
  performanceRating?: number;
  performancePerMsrp?: number;
}
