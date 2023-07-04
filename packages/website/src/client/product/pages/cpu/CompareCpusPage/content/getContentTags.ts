import {
  CpuComparison,
  CpuField,
  hasProductFieldValue,
} from '@pcpartdb/shared';
import { formatCpuField } from '../../../../utils';

export enum CompareCpusContentTag {
  DifferentCompany = 'DIFFERENT_COMPANY',
  SameCompany = 'SAME_COMPANY',
  DifferentMarketSegment = 'DIFFERENT_MARKET_SEGMENT',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  DifferentReleaseDate = 'DIFFERENT_RELEASE_DATE',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  DifferentLaunchPrice = 'DIFFERENT_LAUNCH_PRICE',
  SameLaunchPrice = 'SAME_LAUNCH_PRICE',
  DifferentArchitecture = 'DIFFERENT_ARCHITECTURE',
  SameArchitecture = 'SAME_ARCHITECTURE',
  DifferentGeneration = 'DIFFERENT_GENERATION',
  SameGeneration = 'SAME_GENERATION',
  DifferentSocket = 'DIFFERENT_SOCKET',
  SameSocket = 'SAME_SOCKET',
  DifferentIntegratedGraphics = 'DIFFERENT_INTEGRATED_GRAPHICS',
  SameIntegratedGraphics = 'SAME_INTEGRATED_GRAPHICS',
  DifferentBundledCooler = 'DIFFERENT_BUNDLED_COOLER',
  SameBundledCooler = 'SAME_BUNDLED_COOLER',
  DifferentClock = 'DIFFERENT_CLOCK',
  SameClock = 'SAME_CLOCK',
  DifferentTurboClock = 'DIFFERENT_TURBO_CLOCK',
  SameTurboClock = 'SAME_TURBO_CLOCK',
  CanOverclockCpu1 = 'CAN_OVERCLOCK_CPU1',
  CanOverclockCpu2 = 'CAN_OVERCLOCK_CPU2',
  DifferentL1L2Cache = 'DIFFERENT_L1_L2_CACHE',
  SameL1L2Cache = 'SAME_L1_L2_CACHE',
  SameMemorySupport = 'SAME_MEMORY_SUPPORT',
  SamePciExpress = 'SAME_PCI_EXPRESS',
  SameTdp = 'SAME_TDP',
  SamePerformance = 'SAME_PERFORMANCE',
  SamePerformancePerDollar = 'SAME_PERFORMANCE_PER_DOLLAR',
}

export function getContentTags(comparison: CpuComparison) {
  return {
    ...getGeneralTags(comparison),
  };
}

function getGeneralTags(comparison: CpuComparison) {
  return {
    [CompareCpusContentTag.DifferentCompany]: hasDifferentCompany(comparison),
    [CompareCpusContentTag.SameCompany]: hasSameCompany(comparison),
    [CompareCpusContentTag.DifferentMarketSegment]:
      hasDifferentMarketSegment(comparison),
    [CompareCpusContentTag.SameMarketSegment]: hasSameMarketSegment(comparison),
    [CompareCpusContentTag.DifferentReleaseDate]:
      hasDifferentReleaseDate(comparison),
    [CompareCpusContentTag.SameReleaseDate]: hasSameReleaseDate(comparison),
    [CompareCpusContentTag.DifferentLaunchPrice]:
      hasDifferentLaunchPrice(comparison),
    [CompareCpusContentTag.SameLaunchPrice]: hasSameLaunchPrice(comparison),
    [CompareCpusContentTag.DifferentArchitecture]:
      hasDifferentArchitecture(comparison),
    [CompareCpusContentTag.SameArchitecture]: hasSameArchitecture(comparison),
    [CompareCpusContentTag.DifferentGeneration]:
      hasDifferentGeneration(comparison),
    [CompareCpusContentTag.SameGeneration]: hasSameGeneration(comparison),
    [CompareCpusContentTag.DifferentSocket]: hasDifferentSocket(comparison),
    [CompareCpusContentTag.SameSocket]: hasSameSocket(comparison),
    [CompareCpusContentTag.DifferentIntegratedGraphics]:
      hasDifferentIntegratedGraphics(comparison),
    [CompareCpusContentTag.SameIntegratedGraphics]:
      hasSameIntegratedGraphics(comparison),
    [CompareCpusContentTag.DifferentBundledCooler]:
      hasDifferentBundledCooler(comparison),
    [CompareCpusContentTag.SameBundledCooler]: hasSameBundledCooler(comparison),
    [CompareCpusContentTag.DifferentClock]: hasDifferentClock(comparison),
    [CompareCpusContentTag.SameClock]: hasSameClock(comparison),
    [CompareCpusContentTag.DifferentTurboClock]:
      hasDifferentTurboClock(comparison),
    [CompareCpusContentTag.SameTurboClock]: hasSameTurboClock(comparison),
    [CompareCpusContentTag.CanOverclockCpu1]: canOverclockCpu1(comparison),
    [CompareCpusContentTag.CanOverclockCpu2]: canOverclockCpu2(comparison),
    [CompareCpusContentTag.DifferentL1L2Cache]:
      hasDifferentL1L2Cache(comparison),
    [CompareCpusContentTag.SameL1L2Cache]: hasSameL1L2Cache(comparison),
    [CompareCpusContentTag.SameMemorySupport]: hasSameMemorySupport(comparison),
    [CompareCpusContentTag.SamePciExpress]: hasSamePciExpress(comparison),
    [CompareCpusContentTag.SameTdp]: hasSameTdp(comparison),
    [CompareCpusContentTag.SamePerformance]: hasSamePerformance(comparison),
    [CompareCpusContentTag.SamePerformancePerDollar]:
      hasSamePerformancePerDollar(comparison),
  };
}

function hasDifferentCompany(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.company, cpu2.company);
}

function hasSameCompany(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.company, cpu2.company);
}

function hasDifferentMarketSegment(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return cpu1.marketSegments?.value?.[0] !== cpu2.marketSegments?.value[0];
}

function hasSameMarketSegment(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return cpu1.marketSegments?.value?.[0] === cpu2.marketSegments?.value[0];
}

function hasDifferentReleaseDate(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  if (cpu1.releaseDate == null || cpu2.releaseDate == null) {
    return false;
  }

  return formatCpuField(cpu1.releaseDate) !== formatCpuField(cpu2.releaseDate);
}

function hasSameReleaseDate(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  if (cpu1.releaseDate == null || cpu2.releaseDate == null) {
    return false;
  }

  return formatCpuField(cpu1.releaseDate) === formatCpuField(cpu2.releaseDate);
}

function hasDifferentLaunchPrice(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.launchPrice, cpu2.launchPrice);
}

function hasSameLaunchPrice(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.launchPrice, cpu2.launchPrice);
}

function hasDifferentArchitecture(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.architecture, cpu2.architecture);
}

function hasSameArchitecture(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.architecture, cpu2.architecture);
}

function hasDifferentGeneration(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.generation, cpu2.generation);
}

function hasSameGeneration(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.generation, cpu2.generation);
}

function hasDifferentSocket(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.socket, cpu2.socket);
}

function hasSameSocket(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.socket, cpu2.socket);
}

function hasDifferentIntegratedGraphics(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.integratedGraphics, cpu2.integratedGraphics);
}

function hasSameIntegratedGraphics(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.integratedGraphics, cpu2.integratedGraphics);
}

function hasDifferentBundledCooler(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.bundledCooler, cpu2.bundledCooler);
}

function hasSameBundledCooler(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.bundledCooler, cpu2.bundledCooler);
}

function hasDifferentClock(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.clock, cpu2.clock);
}

function hasSameClock(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.clock, cpu2.clock);
}

function hasDifferentTurboClock(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.turboClock, cpu2.turboClock);
}

function hasSameTurboClock(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.turboClock, cpu2.turboClock);
}

function canOverclockCpu1(comparison: CpuComparison) {
  const [cpu1, _cpu2] = comparison;
  return cpu1.isMultiplierUnlocked?.value === true;
}

function canOverclockCpu2(comparison: CpuComparison) {
  const [_cpu1, cpu2] = comparison;
  return cpu2.isMultiplierUnlocked?.value === true;
}

function hasDifferentL1L2Cache(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return (
    hasDifferentValue(cpu1.l1Cache, cpu2.l1Cache) &&
    hasDifferentValue(cpu1.l2Cache, cpu2.l2Cache)
  );
}

function hasSameL1L2Cache(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return (
    hasSameValue(cpu1.l1Cache, cpu2.l1Cache) &&
    hasSameValue(cpu1.l2Cache, cpu2.l2Cache)
  );
}

function hasSameMemorySupport(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  const areEqual1 =
    cpu1.memorySupport?.value?.every(
      (value) => cpu2.memorySupport?.value?.includes(value) ?? false,
    ) ?? false;
  const areEqual2 =
    cpu2.memorySupport?.value?.every(
      (value) => cpu1.memorySupport?.value?.includes(value) ?? false,
    ) ?? false;
  return areEqual1 && areEqual2;
}

function hasSamePciExpress(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  const areEqual1 =
    cpu1.pciExpress?.value?.every(
      (value) => cpu2.pciExpress?.value?.includes(value) ?? false,
    ) ?? false;
  const areEqual2 =
    cpu2.pciExpress?.value?.every(
      (value) => cpu1.pciExpress?.value?.includes(value) ?? false,
    ) ?? false;
  return areEqual1 && areEqual2;
}

function hasSameTdp(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.tdp, cpu2.tdp);
}

function hasSamePerformance(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.performanceScore, cpu2.performanceScore);
}

function hasSamePerformancePerDollar(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.valueScore, cpu2.valueScore);
}

function hasDifferentValue(field1?: CpuField, field2?: CpuField) {
  if (!hasProductFieldValue(field1) || !hasProductFieldValue(field2)) {
    return false;
  }

  return field1.value !== field2.value;
}

function hasSameValue(field1?: CpuField, field2?: CpuField) {
  if (!hasProductFieldValue(field1) || !hasProductFieldValue(field2)) {
    return false;
  }

  return field1.value === field2.value;
}
