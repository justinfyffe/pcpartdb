import {
  CpuProduct,
  formatGpuDimensions,
  GpuProduct,
  hasProductFieldRawValue,
  hasProductFieldValue,
  hasProductRank,
  isCpuProduct,
  isGpuChipset,
  isGpuProduct,
  isGpuRetaillModel,
  MarketSegment,
  Product,
  productFieldFormattedValue,
  productFieldRawValue,
  ProductionStatus,
  productRankValue,
  RankKey,
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

export enum PerformanceTag {
  Best = 'PERFORMANCE__BEST',

  MarketSegment = 'PERFORMANCE__MARKET_SEGMENT',
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

export enum SpecsTag {
  Architecture = 'SPECS__ARCHITECTURE',
  BundledCooler = 'SPECS__BUNDLED_COOLER',
  Codename = 'SPECS__CODENAME',
  Cores = 'SPECS__CORES',
  Dimensions = 'SPECS__DIMENSIONS',
  Foundry = 'SPECS__FOUNDRY',
  Generation = 'SPECS__GENERATION',
  IntegratedGraphics = 'SPECS__INTEGRATED_GRAPHICS',
  MarketSegment = 'SPECS__MARKET_SEGMENT',
  MemoryBandwidth = 'SPECS__MEMORY_BANDWIDTH',
  MemoryClock = 'SPECS__MEMORY_CLOCK',
  MemoryInterface = 'SPECS__MEMORY_INTERFACE',
  MemorySize = 'SPECS__MEMORY_SIZE',
  Msrp = 'SPECS__MSRP',
  Outputs = 'SPECS__OUTPUTS',
  ProcessSize = 'SPECS__PROCESS_SIZE',
  Socket = 'SPECS__SOCKET',
  ReleaseDate = 'SPECS__RELEASE_DATE',
  SlotWidth = 'SPECS__SLOT_WIDTH',
  SuggestedPsu = 'SPECS__SUGGESTED_PSU',
  Tdp = 'SPECS__TDP',
  Threads = 'SPECS__THREADS',
}

export enum SubProductTypeTag {
  GpuChipset = 'SUB_PRODUCT_TYPE__GPU_CHIPSET',
  GpuRetailModel = 'SUB_PRODUCT_TYPE__GPU_RETAIL_MODEL',
}

export function buildContentTags(product: Product) {
  const tags: ContentTags = {};

  // Market Segment
  tags[MarketSegmentTag.Desktop] =
    productFieldRawValue(product.fields.marketSegment) ===
    MarketSegment.Desktop;
  tags[MarketSegmentTag.Embedded] =
    productFieldRawValue(product.fields.marketSegment) ===
    MarketSegment.Embedded;
  tags[MarketSegmentTag.Integrated] =
    productFieldRawValue(product.fields.marketSegment) ===
    MarketSegment.Integrated;
  tags[MarketSegmentTag.Mobile] =
    productFieldRawValue(product.fields.marketSegment) === MarketSegment.Mobile;
  tags[MarketSegmentTag.Server] =
    productFieldRawValue(product.fields.marketSegment) === MarketSegment.Server;
  tags[MarketSegmentTag.Workstation] =
    productFieldRawValue(product.fields.marketSegment) ===
    MarketSegment.Workstation;

  // Performance
  tags[PerformanceTag.Best] =
    productRankValue(product, RankKey.PerformanceRating) === 1;
  tags[PerformanceTag.MarketSegment] = hasProductRank(
    product,
    RankKey.PerformanceRatingForMarketSegment,
  );

  // Production Status
  tags[ProductionStatusTag.Active] =
    productFieldRawValue(product.fields.productionStatus) ===
    ProductionStatus.Active;
  tags[ProductionStatusTag.EndOfLife] =
    productFieldRawValue(product.fields.productionStatus) ===
    ProductionStatus.EndOfLife;
  tags[ProductionStatusTag.Unreleased] =
    productFieldRawValue(product.fields.productionStatus) ===
    ProductionStatus.Unreleased;

  // Product Type
  tags[ProductTypeTag.Cpu] = isCpuProduct(product);
  tags[ProductTypeTag.Gpu] = isGpuProduct(product);

  // Specs
  tags[SpecsTag.Architecture] = hasProductFieldValue(
    product.fields.architecture,
  );
  tags[SpecsTag.Codename] = hasProductFieldValue(product.fields.codename);
  tags[SpecsTag.MarketSegment] = hasProductFieldValue(
    product.fields.marketSegment,
  );
  tags[SpecsTag.Msrp] = hasProductFieldValue(product.fields.msrp);
  tags[SpecsTag.ProcessSize] = hasProductFieldValue(product.fields.processSize);
  tags[SpecsTag.ReleaseDate] = hasProductFieldValue(product.fields.releaseDate);
  tags[SpecsTag.Tdp] = hasProductFieldValue(product.fields.tdp);

  // Sub Product Type
  tags[SubProductTypeTag.GpuChipset] = isGpuChipset(product);
  tags[SubProductTypeTag.GpuRetailModel] = isGpuRetaillModel(product);

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

  tags[SpecsTag.BundledCooler] = hasProductFieldValue(
    product.fields.bundledCooler,
  );
  tags[SpecsTag.Cores] = hasProductFieldValue(product.fields.cores);
  tags[SpecsTag.Foundry] = hasProductFieldValue(product.fields.foundry);
  tags[SpecsTag.Generation] = hasProductFieldValue(product.fields.generation);
  tags[SpecsTag.IntegratedGraphics] = hasProductFieldValue(
    product.fields.integratedGraphics,
  );
  tags[SpecsTag.Socket] = hasProductFieldValue(product.fields.socket);
  tags[SpecsTag.Threads] = hasProductFieldRawValue(product.fields.threads);

  return tags;
}

function buildGpuContentTags(product: GpuProduct) {
  const tags: ContentTags = {};
  if (!isGpuProduct(product)) {
    return {};
  }

  const marketSegment = productFieldRawValue(product.fields.marketSegment);

  let hasOutputs = hasProductFieldValue(product.fields.outputs);
  const outputs = productFieldFormattedValue(
    product.fields.outputs,
  ).toLowerCase();

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
    product.fields.memoryBandwidth,
  );
  tags[SpecsTag.MemoryClock] = hasProductFieldRawValue(
    product.fields.memoryClock,
  );
  tags[SpecsTag.MemoryInterface] = hasProductFieldRawValue(
    product.fields.memoryInterface,
  );
  tags[SpecsTag.MemorySize] = hasProductFieldRawValue(
    product.fields.memorySize,
  );
  tags[SpecsTag.Outputs] = hasOutputs;
  tags[SpecsTag.SlotWidth] = hasProductFieldRawValue(product.fields.slotWidth);
  tags[SpecsTag.SuggestedPsu] = hasProductFieldValue(
    product.fields.suggestedPsu,
  );

  return tags;
}
