import { schema } from 'normalizr';
import { AutomationSource } from '../automation';
import { deepmerge } from '../utils';
import { ProductBenchmark } from './benchmarks';
import { CpuFields, GpuFields, ProductFields } from './fields';
import { ProductGame, ProductGameFps } from './game';
import { ProductImage } from './images';
import { ProductRanks } from './ranks';
import { RelatedProducts } from './related';
import { ProductSource } from './sources';
import { ProductUpdate } from './updates';

// Enums

export enum ProductType {
  Cpu = 'CPU',
  Gpu = 'GPU',
}

export enum SubProductType {
  GpuChipset = 'GPU_CHIPSET',
  GpuRetailModel = 'GPU_RETAIL_MODEL',
}

// Consts

export const SUPPORTED_CPU_COMPANIES = ['amd', 'intel'];

export const SUPPORTED_GPU_COMPANIES = [
  'acer',
  'amd',
  'asrock',
  'asus',
  'ati',
  'evga',
  'gainward',
  'galax',
  'gigabyte',
  'inno3d',
  'intel',
  'msi',
  'nvidia',
  'pny',
  'powercolor',
  'sapphire',
  'xfx',
  'zotac',
];

// Products

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
  summaryPublishedAt?: number;
  summaryStale?: boolean;
  enablePerformanceSummary?: boolean;

  latestPrice?: number;
  priceAsOf?: number;
  viewable?: boolean;

  metadata?: ProductMeta;

  automatedAt?: number;

  fields?: ProductFields;
  benchmarks?: ProductBenchmark[];
  games?: ProductGame[];
  sources?: ProductSource[];
  updates?: ProductUpdate[];
  images?: ProductImage[];
  relatedAutomationSources?: AutomationSource[]; // TODO: is this needed?
  parent?: Product;
  children?: Product[];

  ranks?: ProductRanks;
  relatedProducts?: RelatedProducts;
}
export interface ProductMeta {}

export interface CpuProduct extends Product {
  productType: ProductType.Cpu;
  fields?: CpuFields;
}

export interface GpuProduct extends Product {
  productType: ProductType.Gpu;
  fields?: GpuFields;
  parent?: GpuProduct;
}

// Product Comparisons

export type ProductComparison = [Partial<Product>, Partial<Product>];
export type CpuProductComparison = [CpuProduct, CpuProduct];
export type GpuProductComparison = [GpuProduct, GpuProduct];
