import {
  Gpu,
  GpuMarketSegmentValue,
  GpuProductionStatusValue,
  hasGpuLaunched,
  ViewGpuContentData,
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

  BestPerformance = 'BEST_PERFORMANCE',
  BestPerformanceForArchitectureSegment = 'BEST_PERFORMANCE_FOR_ARCHITECTURE_SEGMENT',
  BestPerformanceForCompanySegment = 'BEST_PERFORMANCE_FOR_COMPANY_SEGMENT',
  BestPerformanceForSegment = 'BEST_PERFORMANCE_FOR_SEGMENT',
  BestValue = 'BEST_VALUE',
  BestValueForSegment = 'BEST_VALUE_FOR_SEGMENT',
}

export function getContentTags(gpu: Gpu, contentData: ViewGpuContentData) {
  return {
    ...getGeneralTags(gpu, contentData),
    ...getCompatibilityTags(gpu),
    ...getPerformanceTags(gpu),
  };
}

export function getGeneralTags(gpu: Gpu, contentData: ViewGpuContentData) {
  return {
    [ViewGpuContentTag.Launched]: hasGpuLaunched(gpu),
    [ViewGpuContentTag.IsChipset]: gpu.chipset == null,
    [ViewGpuContentTag.IsRetailModel]: gpu.chipset != null,
    [ViewGpuContentTag.OnlyRetailModel]:
      gpu.chipset != null && contentData.retailModels?.length === 1,
    [ViewGpuContentTag.IsDesktop]:
      gpu.marketSegment?.value === GpuMarketSegmentValue.Desktop,
    [ViewGpuContentTag.IsWorkstation]:
      gpu.marketSegment?.value === GpuMarketSegmentValue.Workstation,
    [ViewGpuContentTag.IsMobile]:
      gpu.marketSegment?.value === GpuMarketSegmentValue.Mobile,
    [ViewGpuContentTag.IsIntegrated]:
      gpu.marketSegment?.value === GpuMarketSegmentValue.Integrated,
    [ViewGpuContentTag.IsUnreleased]:
      gpu.productionStatus?.value === GpuProductionStatusValue.Unreleased,
    [ViewGpuContentTag.IsEndOfLife]:
      gpu.productionStatus?.value === GpuProductionStatusValue.EndOfLife,
  };
}

export function getCompatibilityTags(gpu: Gpu) {
  const slots = gpu.slotWidth?.value;

  return {
    [ViewGpuContentTag.ExtraLargeSize]: slots > 3,
    [ViewGpuContentTag.LargeSize]: slots > 2.5 && slots <= 3,
    [ViewGpuContentTag.CommonSize]: slots <= 2.5 && slots >= 2,
    [ViewGpuContentTag.SmallSize]: slots < 2 && slots >= 1.5,
    [ViewGpuContentTag.CompactSize]: slots < 1.5,
  };
}

export function getPerformanceTags(gpu: Gpu) {
  return {
    [ViewGpuContentTag.BestPerformance]: gpu.ranks?.performanceRank === 1,
    [ViewGpuContentTag.BestPerformanceForArchitectureSegment]:
      gpu.ranks?.performanceRankForArchitectureSegment === 1,
    [ViewGpuContentTag.BestPerformanceForCompanySegment]:
      gpu.ranks?.performanceRankForCompanySegment === 1,
    [ViewGpuContentTag.BestPerformanceForSegment]:
      gpu.ranks?.performanceRankForSegment === 1,
    [ViewGpuContentTag.BestValue]: gpu.ranks?.valueRank === 1,
  };
}
