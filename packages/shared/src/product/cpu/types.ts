import { AutomationSource } from '../../automation';
import { ListQuery } from '../../common';
import {
  MarketSegment,
  Product,
  ProductField,
  ProductFieldMeta,
  ProductionStatus,
  ProductType,
} from '..';

export type CpuFieldKey = keyof Omit<CpuFields, 'id' | 'productId'>;

export interface CpuFieldMeta extends ProductFieldMeta {
  fieldKey?: CpuFieldKey;
}

export interface CpuFieldsMeta {}

export interface CpuField<T = unknown> extends ProductField<T> {
  meta?: CpuFieldMeta;
}

export interface CpuFields {
  id?: number;
  productId?: number;

  architecture?: CpuField<string>;
  baseClock?: CpuField<number>;
  bundledCooler?: CpuField<string>;
  chipsets?: CpuField<string>;
  clock?: CpuField<number>;
  codename?: CpuField<string>;
  cores?: CpuField<number>;
  dieSize?: CpuField<number>;
  eccMemory?: CpuField<boolean>;
  eCores?: CpuField<number>; // Efficient Cores
  eCoreClock?: CpuField<number>; // Efficient Cores Clock
  eCoreL1Cache?: CpuField<number>; // Efficient Core L1 Cache
  eCoreL2Cache?: CpuField<number>; // Efficient Core L2 Cache
  eCoreTurboClock?: CpuField<number>; // Efficient Cores Turbo Clock
  extensionsTechnologies?: CpuField<string>;
  foundry?: CpuField<string>;
  generation?: CpuField<string>;
  integratedGraphics?: CpuField<string>;
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  marketSegment?: CpuField<MarketSegment>;
  memoryChannels?: CpuField<number>;
  memorySupport?: CpuField<string>; // Example: DDR4-3200, DDR5-5600
  msrp?: CpuField<number>;
  multiplier?: CpuField<number>;
  multiplierUnlocked?: CpuField<boolean>;
  partNumber?: CpuField<string>;
  pciExpress?: CpuField<string>; // Example: PCIe 4.0 x4, PCIe 5.0 x16
  pCores?: CpuField<number>; // Performance Cores
  pCoreClock?: CpuField<number>; // Performance Cores Clock
  pCoreTurboClock?: CpuField<number>; // Performance Cores Turbo Clock
  pl1?: CpuField<number>; // Power Level 1 - stock (marketed) power state
  pl2?: CpuField<number>; // Power Level 2 - Power state when CPU uses turbo frequencies.
  ppt?: CpuField<number>; // Package Power Tracking - Measurement of power to the CPU Socket on the mobo
  processSize?: CpuField<number>;
  productionStatus?: CpuField<ProductionStatus>;
  releaseDate?: CpuField<string>;
  smp?: CpuField<number>; // Symmetric Multiprocessing
  socket?: CpuField<string>;
  tCaseMax?: CpuField<number>; // Max case temperature
  tdp?: CpuField<number>;
  threads?: CpuField<number>;
  tjMax?: CpuField<number>; // Max core temperature
  transistors?: CpuField<number>;
  turboClock?: CpuField<number>;

  performanceRating?: CpuField<number>;
  performancePerMsrp?: CpuField<number>;

  metadata?: CpuFieldsMeta;
}

export interface CpuProduct extends Product {
  productType: ProductType.Cpu;
  fields?: CpuFields;
}

export type CpuProductComparison = [CpuProduct, CpuProduct];

export enum ListCpusPresetSlug {
  BestPerformance = 'best-performance',
  BestPerformanceAmd = 'best-performance-amd',
  BestPerformanceIntel = 'best-performance-intel',
  BestValue = 'best-value',
  BestValueAmd = 'best-value-amd',
  BestValueIntel = 'best-value-intel',
  Newest = 'newest',
  Oldest = 'oldest',
}

export interface ListCpusFilter {
  company?: string[];
  year?: number[];
  segment?: MarketSegment[];

  maxPerformanceScore?: number;
  minPerformanceScore?: number;
  maxValueScore?: number;
  minValueScore?: number;

  performanceRated?: boolean;
  valueRated?: boolean;

  ids?: number[];
  excludeIds?: number[];
}
export interface ListCpusQuery extends ListQuery<ListCpusFilter> {}

export interface ListCpusAdditionalData {}

/**
 * Group of CPU automation sources, usually grouped by source name.
 */
export type CpuAutomationSourceGroup = AutomationSource[];
