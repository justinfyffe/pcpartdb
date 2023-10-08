import {
  CpuField,
  MarketSegment,
  ProductBenchmark,
  ProductImage,
  ProductionStatus,
  ProductSource,
} from '@pcpartdb/shared';

export interface CpuFormData {
  name: string;
  slug: string;
  company?: string;
  otherNames?: string[];
  searchText?: string;
  affiliateUrl?: string;

  // General Info
  partNumber?: CpuField<string>;
  marketSegment?: CpuField<MarketSegment>;
  msrp?: CpuField<number>;
  releaseDate?: CpuField<string>;
  productionStatus?: CpuField<ProductionStatus>;
  bundledCooler?: CpuField<string>;

  //
  socket?: CpuField<string>;
  foundry?: CpuField<string>;
  processSize?: CpuField<number>;
  transistors?: CpuField<number>;
  tCaseMax?: CpuField<number>; // Max case temperature
  tjMax?: CpuField<number>; // Max core temperature

  //
  architecture?: CpuField<string>;
  codename?: CpuField<string>;
  generation?: CpuField<string>;
  pciExpress?: CpuField<string>;
  chipsets?: CpuField<string>;

  //
  memorySupport?: CpuField<string>;
  memoryChannels?: CpuField<number>;
  eccMemory?: CpuField<boolean>;

  //
  cores?: CpuField<number>;
  threads?: CpuField<number>;
  pCores?: CpuField<number>;
  eCores?: CpuField<number>;
  clock?: CpuField<number>;
  turboClock?: CpuField<number>;
  pCoreClock?: CpuField<number>;
  pCoreTurboClock?: CpuField<number>;
  eCoreClock?: CpuField<number>;
  eCoreTurboClock?: CpuField<number>;
  baseClock?: CpuField<number>;
  multiplier?: CpuField<number>;
  multiplierUnlocked?: CpuField<boolean>;

  //
  tdp?: CpuField<number>;
  pl1?: CpuField<number>;
  pl2?: CpuField<number>;
  ppt: CpuField<number>;

  //
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  eCoreL1Cache?: CpuField<number>;
  eCoreL2Cache?: CpuField<number>;

  // Graphics
  integratedGraphics?: CpuField<string>;

  // Features
  extensionsTechnologies?: CpuField<string>;

  // Benchmarks
  benchmarks?: ProductBenchmark[];

  // Sources
  sources?: ProductSource[];

  // Images
  images?: ProductImage[];
}
