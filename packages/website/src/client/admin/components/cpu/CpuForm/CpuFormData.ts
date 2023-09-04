import {
  CpuDataSource,
  CpuField,
  CpuImages,
  CpuMarketSegmentValue,
  CpuProductionStatusValue,
} from '@pcpartdb/shared';

export interface CpuFormData {
  slug: string;
  name: string;
  affiliateUrl?: string;

  // Data Sourcese
  techPowerUpSource?: CpuDataSource;
  passMarkSource?: CpuDataSource;
  geekBenchSource?: CpuDataSource;

  // General Info
  partNumber?: CpuField<string>;
  company?: CpuField<string>;
  marketSegment?: CpuField<CpuMarketSegmentValue>;
  launchPrice?: CpuField<number>;
  releaseDate?: CpuField<string>;
  productionStatus?: CpuField<CpuProductionStatusValue>;
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
  pciExpress?: CpuField<string[]>;
  chipsets?: CpuField<string[]>;

  //
  memorySupport?: CpuField<string[]>;
  memoryChannels?: CpuField<number>;
  hasEccMemory?: CpuField<boolean>;

  //
  coresCount?: CpuField<number>;
  threadsCount?: CpuField<number>;
  performanceCoresCount?: CpuField<number>;
  efficientCoresCount?: CpuField<number>;
  clock?: CpuField<number>;
  turboClock?: CpuField<number>;
  performanceCoreClock?: CpuField<number>;
  performanceCoreTurboClock?: CpuField<number>;
  efficientCoreClock?: CpuField<number>;
  efficientCoreTurboClock?: CpuField<number>;
  baseClock?: CpuField<number>;
  multiplier?: CpuField<number>;
  isMultiplierUnlocked?: CpuField<boolean>;

  //
  tdp?: CpuField<number>;
  pl1?: CpuField<number>;
  pl2?: CpuField<number>;
  ppt: CpuField<number>;

  //
  l1Cache?: CpuField<number>;
  l2Cache?: CpuField<number>;
  l3Cache?: CpuField<number>;
  efficientCoreL1Cache?: CpuField<number>;
  efficientCoreL2Cache?: CpuField<number>;

  // Graphics
  integratedGraphics?: CpuField<string>;

  // Features
  extensionsTechnologies?: CpuField<string[]>;

  // Benchmarks
  performanceScore?: CpuField<number>;
  valueScore?: CpuField<number>;
  cpuMarkMultiThread?: CpuField<number>;
  cpuMarkSingleThread?: CpuField<number>;
  geekbenchSingleCore?: CpuField<number>;
  geekbenchMultiCore?: CpuField<number>;

  // Images
  images?: CpuImages;
}
