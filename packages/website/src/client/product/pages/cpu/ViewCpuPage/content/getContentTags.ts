import {
  CpuProduct,
  hasProductFieldRawValue,
  MarketSegment,
  productFieldRawValue,
  productRankValue,
  RankKey,
  ViewCpuContentData,
} from '@pcpartdb/shared';

export enum ViewCpuContentTag {
  IsDesktop = 'IS_DESKTOP',
  BestPerformance = 'BEST_PERFORMANCE',
  HasBundledCooler = 'HAS_BUNDLED_COOLER',
  HasUnlockedMultiplier = 'HAS_UNLOCKED_MULTIPLIER',
}

export function getContentTags(
  cpu: CpuProduct,
  _additionalData: ViewCpuContentData,
) {
  return {
    [ViewCpuContentTag.BestPerformance]:
      productRankValue(cpu, RankKey.PerformanceRating) === 1,
    [ViewCpuContentTag.HasBundledCooler]: hasProductFieldRawValue(
      cpu.fields?.bundledCooler,
    ),
    [ViewCpuContentTag.IsDesktop]:
      productFieldRawValue(cpu.fields?.marketSegment) === MarketSegment.Desktop,
    [ViewCpuContentTag.HasUnlockedMultiplier]:
      productFieldRawValue(cpu.fields?.multiplierUnlocked) || false,
  };
}
