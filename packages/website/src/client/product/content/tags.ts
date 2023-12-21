import {
  BenchmarkKey,
  CpuProduct,
  formatGpuDimensions,
  getProductPerformanceRank,
  GpuProduct,
  hasBenchmarkPerformanceRank,
  hasBenchmarkValueRank,
  hasProductFieldRawValue,
  isCpuProduct,
  isGpuChipset,
  isGpuProduct,
  isGpuRetailModel,
  MarketSegment,
  Product,
  productFieldFormattedValue,
  productFieldRawValue,
  ProductionStatus,
} from '@pcpartdb/shared';
import { ContentTags } from 'packages/website/src/client/shared/content/types';

export enum MarketSegmentTag {
  Desktop = 'MARKET_SEGMENT__DESKTOP',
  Embedded = 'MARKET_SEGMENT__EMBEDDED',
  Integrated = 'MARKET_SEGMENT__INTEGRATED',
  Mobile = 'MARKET_SEGMENT__MOBILE',
  Server = 'MARKET_SEGMENT__SERVER',
  Workstation = 'MARKET_SEGMENT__WORKSTATION',
}

export enum ProductionStatusTag {
  Active = 'PRODUCTION_STATUS__ACTIVE',
  EndOfLife = 'PRODUCTION_STATUS__END_OF_LIFE',
  Unreleased = 'PRODUCTION_STATUS__UNRELEASED',
}

export enum ProductTypeTag {
  Cpu = 'PRODUCT_TYPE__CPU',
  Gpu = 'PRODUCT_TYPE__GPU',
}

export enum RankTag {
  BestPerformance = 'RANK__BEST_PERFORMANCE',

  Performance = 'RANK__PERFORMANCE',
  Value = 'RANK__VALUE',
}

export enum SpecsTag {
  Architecture = 'SPECS__ARCHITECTURE',
  BoostClock = 'SPECS__BOOST_CLOCK',
  BundledCooler = 'SPECS__BUNDLED_COOLER',
  Clock = 'SPECS__CLOCK',
  Codename = 'SPECS__CODENAME',
  Cores = 'SPECS__CORES',
  Dimensions = 'SPECS__DIMENSIONS',
  Foundry = 'SPECS__FOUNDRY',
  Generation = 'SPECS__GENERATION',
  IntegratedGraphics = 'SPECS__INTEGRATED_GRAPHICS',
  L1Cache = 'SPECS_L1_CACHE',
  L2Cache = 'SPECS_L2_CACHE',
  L3Cache = 'SPECS_L3_CACHE',
  LockedMultiplier = 'SPECS__LOCKED_MULTIPLIER',
  MarketSegment = 'SPECS__MARKET_SEGMENT',
  MemoryBandwidth = 'SPECS__MEMORY_BANDWIDTH',
  MemoryChannels = 'SPECS__MEMORY_CHANNELS',
  MemoryClock = 'SPECS__MEMORY_CLOCK',
  MemoryInterface = 'SPECS__MEMORY_INTERFACE',
  MemorySize = 'SPECS__MEMORY_SIZE',
  MemorySupport = 'SPECS__MEMORY_SUPPORT',
  Msrp = 'SPECS__MSRP',
  Outputs = 'SPECS__OUTPUTS',
  PciExpress = 'SPECS__PCI_EXPRESS',
  ProcessSize = 'SPECS__PROCESS_SIZE',
  Socket = 'SPECS__SOCKET',
  ReleaseDate = 'SPECS__RELEASE_DATE',
  SlotWidth = 'SPECS__SLOT_WIDTH',
  SuggestedPsu = 'SPECS__SUGGESTED_PSU',
  Tdp = 'SPECS__TDP',
  Threads = 'SPECS__THREADS',
  UnlockedMultiplier = 'SPECS__UNLOCKED_MULTIPLIER',
}

export enum SubProductTypeTag {
  GpuChipset = 'SUB_PRODUCT_TYPE__GPU_CHIPSET',
  GpuRetailModel = 'SUB_PRODUCT_TYPE__GPU_RETAIL_MODEL',
}

export interface BuildContentTagsOptions {
  preferredBenchmark: BenchmarkKey;
  product: Product;
}

export function buildContentTags(options: BuildContentTagsOptions) {
  const { product, preferredBenchmark } = options;
  const tags: ContentTags = {};

  // Market Segment
  tags[MarketSegmentTag.Desktop] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Desktop;
  tags[MarketSegmentTag.Embedded] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Embedded;
  tags[MarketSegmentTag.Integrated] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Integrated;
  tags[MarketSegmentTag.Mobile] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Mobile;
  tags[MarketSegmentTag.Server] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Server;
  tags[MarketSegmentTag.Workstation] =
    productFieldRawValue(product?.fields?.marketSegment) ===
    MarketSegment.Workstation;

  // Production Status
  tags[ProductionStatusTag.Active] =
    productFieldRawValue(product?.fields?.productionStatus) ===
    ProductionStatus.Active;
  tags[ProductionStatusTag.EndOfLife] =
    productFieldRawValue(product?.fields?.productionStatus) ===
    ProductionStatus.EndOfLife;
  tags[ProductionStatusTag.Unreleased] =
    productFieldRawValue(product?.fields?.productionStatus) ===
    ProductionStatus.Unreleased;

  // Product Type
  tags[ProductTypeTag.Cpu] = isCpuProduct(product);
  tags[ProductTypeTag.Gpu] = isGpuProduct(product);

  // Ranks
  tags[RankTag.BestPerformance] =
    getProductPerformanceRank(
      product?.parent || product,
      preferredBenchmark,
    ) === 1;
  tags[RankTag.Performance] = hasBenchmarkPerformanceRank(
    product?.parent || product,
    preferredBenchmark,
  );
  tags[RankTag.Value] = hasBenchmarkValueRank(
    product?.parent || product,
    preferredBenchmark,
  );

  // Specs
  tags[SpecsTag.Architecture] = hasProductFieldRawValue(
    product?.fields?.architecture,
  );
  tags[SpecsTag.Codename] = hasProductFieldRawValue(product?.fields?.codename);
  tags[SpecsTag.MarketSegment] = hasProductFieldRawValue(
    product?.fields?.marketSegment,
  );
  tags[SpecsTag.Msrp] = hasProductFieldRawValue(product?.fields?.msrp);
  tags[SpecsTag.ProcessSize] = hasProductFieldRawValue(
    product?.fields?.processSize,
  );
  tags[SpecsTag.ReleaseDate] = hasProductFieldRawValue(
    product?.fields?.releaseDate,
  );
  tags[SpecsTag.Tdp] = hasProductFieldRawValue(product?.fields?.tdp);

  // Sub Product Type
  tags[SubProductTypeTag.GpuChipset] = isGpuChipset(product);
  tags[SubProductTypeTag.GpuRetailModel] = isGpuRetailModel(product);

  return {
    ...tags,
    ...buildCpuContentTags(product as CpuProduct),
    ...buildGpuContentTags(product as GpuProduct),
  };
}

function buildCpuContentTags(product: CpuProduct) {
  const tags: ContentTags = {};
  if (!isCpuProduct(product)) {
    return {};
  }

  tags[SpecsTag.BoostClock] = hasProductFieldRawValue(
    product?.fields?.turboClock,
  );
  tags[SpecsTag.BundledCooler] = hasProductFieldRawValue(
    product?.fields?.bundledCooler,
  );
  tags[SpecsTag.Clock] = hasProductFieldRawValue(product?.fields?.clock);
  tags[SpecsTag.Cores] = hasProductFieldRawValue(product?.fields?.cores);
  tags[SpecsTag.Foundry] = hasProductFieldRawValue(product?.fields?.foundry);
  tags[SpecsTag.Generation] = hasProductFieldRawValue(
    product?.fields?.generation,
  );
  tags[SpecsTag.IntegratedGraphics] = hasProductFieldRawValue(
    product?.fields?.integratedGraphics,
  );
  tags[SpecsTag.L1Cache] = hasProductFieldRawValue(product?.fields?.l1Cache);
  tags[SpecsTag.L2Cache] = hasProductFieldRawValue(product?.fields?.l2Cache);
  tags[SpecsTag.L3Cache] = hasProductFieldRawValue(product?.fields?.l3Cache);
  tags[SpecsTag.LockedMultiplier] =
    productFieldRawValue(product?.fields?.multiplierUnlocked) === false;
  tags[SpecsTag.MemoryChannels] = hasProductFieldRawValue(
    product?.fields?.memorySupport,
  );
  tags[SpecsTag.MemorySupport] = hasProductFieldRawValue(
    product?.fields?.memorySupport,
  );
  tags[SpecsTag.Socket] = hasProductFieldRawValue(product?.fields?.socket);
  tags[SpecsTag.Threads] = hasProductFieldRawValue(product?.fields?.threads);
  tags[SpecsTag.UnlockedMultiplier] =
    productFieldRawValue(product?.fields?.multiplierUnlocked) === true;

  return tags;
}

function buildGpuContentTags(product: GpuProduct) {
  const tags: ContentTags = {};
  if (!isGpuProduct(product)) {
    return {};
  }

  const marketSegment = productFieldRawValue(product?.fields?.marketSegment);

  let hasOutputs = hasProductFieldRawValue(product?.fields?.outputs);
  const outputs = productFieldFormattedValue(
    product?.fields?.outputs,
  )?.toLowerCase();

  if (
    marketSegment !== MarketSegment.Desktop &&
    marketSegment !== MarketSegment.Workstation
  ) {
    hasOutputs = false;
  } else if (outputs === 'no outputs') {
    hasOutputs = false;
  } else if (outputs.includes('dependent')) {
    hasOutputs = false;
  }

  const hasDimensions =
    formatGpuDimensions(product) != null &&
    (marketSegment === MarketSegment.Desktop ||
      marketSegment === MarketSegment.Workstation);

  tags[SpecsTag.Dimensions] = hasDimensions;
  tags[SpecsTag.MemoryBandwidth] = hasProductFieldRawValue(
    product?.fields?.memoryBandwidth,
  );
  tags[SpecsTag.MemoryClock] = hasProductFieldRawValue(
    product?.fields?.memoryClock,
  );
  tags[SpecsTag.MemoryInterface] = hasProductFieldRawValue(
    product?.fields?.memoryInterface,
  );
  tags[SpecsTag.MemorySize] = hasProductFieldRawValue(
    product?.fields?.memorySize,
  );
  tags[SpecsTag.Outputs] = hasOutputs;
  tags[SpecsTag.SlotWidth] = hasProductFieldRawValue(
    product?.fields?.slotWidth,
  );
  tags[SpecsTag.SuggestedPsu] = hasProductFieldRawValue(
    product?.fields?.suggestedPsu,
  );

  return tags;
}
