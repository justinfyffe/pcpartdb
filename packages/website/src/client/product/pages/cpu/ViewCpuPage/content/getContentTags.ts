import {
  Cpu,
  CpuMarketSegmentValue,
  hasProductFieldValue,
  ViewCpuContentData,
} from '@pcpartdb/shared';

export enum ViewCpuContentTag {
  IsDesktop = 'IS_DESKTOP',
  BestPerformance = 'BEST_PERFORMANCE',
  HasBundledCooler = 'HAS_BUNDLED_COOLER',
  HasUnlockedMultiplier = 'HAS_UNLOCKED_MULTIPLIER',
}

export function getContentTags(cpu: Cpu, _contentData: ViewCpuContentData) {
  return {
    [ViewCpuContentTag.BestPerformance]: cpu.ranks?.performanceRank === 1,
    [ViewCpuContentTag.HasBundledCooler]: hasProductFieldValue(
      cpu.bundledCooler,
    ),
    [ViewCpuContentTag.IsDesktop]:
      cpu.marketSegment?.value === CpuMarketSegmentValue.Desktop,
    [ViewCpuContentTag.HasUnlockedMultiplier]:
      cpu.isMultiplierUnlocked?.value ?? false,
  };
}
