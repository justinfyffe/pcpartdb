import {
  GpuProduct,
  hasGpuLaunched,
  MarketSegment,
  productFieldRawValue,
  ProductionStatus,
  productRankValue,
  RankKey,
  ViewGpuAdditionalData,
} from '@pcpartdb/shared';

export enum ViewGpuContentTag {
  Launched = 'LAUNCHED',
  IsChipset = 'IS_CHIPSET',
  IsRetailModel = 'IS_RETAIL_MODEL',
  OnlyRetailModel = 'ONLY_RETAIL_MODEL',
  IsDesktop = 'IS_DESKTOP',
  IsWorkstation = 'IS_WORKSTATION',
  IsMobile = 'IS_MOBILE',
  IsIntegrated = 'IS_INTEGRATED',
  IsUnreleased = 'IS_UNRELEASED',
  IsEndOfLife = 'IS_END_OF_LIFE',

  CommonSize = 'COMMON_SIZE',
  ExtraLargeSize = 'EXTRA_LARGE_SIZE',
  LargeSize = 'LARGE_SIZE',
  SmallSize = 'SMALL_SIZE',
  CompactSize = 'COMPACT_SIZE',

  BestPerformanceForSegment = 'BEST_PERFORMANCE_FOR_SEGMENT',
}

export function getContentTags(
  gpu: GpuProduct,
  additionalData: ViewGpuAdditionalData,
) {
  return {
    ...getGeneralTags(gpu, additionalData),
    ...getCompatibilityTags(gpu),
    ...getPerformanceTags(gpu),
  };
}

export function getGeneralTags(
  gpu: GpuProduct,
  contentData: ViewGpuAdditionalData,
) {
  return {
    [ViewGpuContentTag.Launched]: hasGpuLaunched(gpu),
    [ViewGpuContentTag.IsChipset]: gpu.parent == null,
    [ViewGpuContentTag.IsRetailModel]: gpu.parent != null,
    [ViewGpuContentTag.OnlyRetailModel]:
      gpu.parent != null && contentData.retailModels?.length === 1,
    [ViewGpuContentTag.IsDesktop]:
      productFieldRawValue(gpu.fields?.marketSegment) === MarketSegment.Desktop,
    [ViewGpuContentTag.IsWorkstation]:
      productFieldRawValue(gpu.fields?.marketSegment) ===
      MarketSegment.Workstation,
    [ViewGpuContentTag.IsMobile]:
      productFieldRawValue(gpu.fields?.marketSegment) === MarketSegment.Mobile,
    [ViewGpuContentTag.IsIntegrated]:
      productFieldRawValue(gpu.fields?.marketSegment) ===
      MarketSegment.Integrated,
    [ViewGpuContentTag.IsUnreleased]:
      productFieldRawValue(gpu.fields?.productionStatus) ===
      ProductionStatus.Unreleased,
    [ViewGpuContentTag.IsEndOfLife]:
      productFieldRawValue(gpu.fields?.productionStatus) ===
      ProductionStatus.EndOfLife,
  };
}

export function getCompatibilityTags(gpu: GpuProduct) {
  const slots = productFieldRawValue(gpu.fields?.slotWidth);

  return {
    [ViewGpuContentTag.ExtraLargeSize]: slots > 3,
    [ViewGpuContentTag.LargeSize]: slots > 2.5 && slots <= 3,
    [ViewGpuContentTag.CommonSize]: slots <= 2.5 && slots >= 2,
    [ViewGpuContentTag.SmallSize]: slots < 2 && slots >= 1.5,
    [ViewGpuContentTag.CompactSize]: slots < 1.5,
  };
}

export function getPerformanceTags(gpu: GpuProduct) {
  return {
    [ViewGpuContentTag.BestPerformanceForSegment]:
      productRankValue(gpu, RankKey.PerformanceRatingForMarketSegment) === 1,
  };
}
