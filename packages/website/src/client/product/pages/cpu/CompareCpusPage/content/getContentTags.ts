import {
  CpuField,
  CpuProductComparison,
  formatCompanyName,
  hasProductFieldRawValue,
  productFieldFormattedValue,
} from '@pcpartdb/shared';

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

export function getContentTags(comparison: CpuProductComparison) {
  return {
    ...getGeneralTags(comparison),
  };
}

function getGeneralTags(comparison: CpuProductComparison) {
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

function hasDifferentCompany(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return formatCompanyName(cpu1.company) !== formatCompanyName(cpu2.company);
}

function hasSameCompany(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return formatCompanyName(cpu1.company) === formatCompanyName(cpu2.company);
}

function hasDifferentMarketSegment(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(
    cpu1.fields?.marketSegment,
    cpu2.fields?.marketSegment,
  );
}

function hasSameMarketSegment(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.marketSegment, cpu2.fields?.marketSegment);
}

function hasDifferentReleaseDate(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  if (cpu1.fields?.releaseDate == null || cpu2.fields?.releaseDate == null) {
    return false;
  }

  return (
    productFieldFormattedValue(cpu1.fields?.releaseDate) !==
    productFieldFormattedValue(cpu2.fields?.releaseDate)
  );
}

function hasSameReleaseDate(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  if (cpu1.fields?.releaseDate == null || cpu2.fields?.releaseDate == null) {
    return false;
  }

  return (
    productFieldFormattedValue(cpu1.fields?.releaseDate) ===
    productFieldFormattedValue(cpu2.fields?.releaseDate)
  );
}

function hasDifferentLaunchPrice(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.fields?.msrp, cpu2.fields?.msrp);
}

function hasSameLaunchPrice(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.msrp, cpu2.fields?.msrp);
}

function hasDifferentArchitecture(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(
    cpu1.fields?.architecture,
    cpu2.fields?.architecture,
  );
}

function hasSameArchitecture(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.architecture, cpu2.fields?.architecture);
}

function hasDifferentGeneration(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.fields?.generation, cpu2.fields?.generation);
}

function hasSameGeneration(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.generation, cpu2.fields?.generation);
}

function hasDifferentSocket(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.fields?.socket, cpu2.fields?.socket);
}

function hasSameSocket(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.socket, cpu2.fields?.socket);
}

function hasDifferentIntegratedGraphics(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(
    cpu1.fields?.integratedGraphics,
    cpu2.fields?.integratedGraphics,
  );
}

function hasSameIntegratedGraphics(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(
    cpu1.fields?.integratedGraphics,
    cpu2.fields?.integratedGraphics,
  );
}

function hasDifferentBundledCooler(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(
    cpu1.fields?.bundledCooler,
    cpu2.fields?.bundledCooler,
  );
}

function hasSameBundledCooler(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.bundledCooler, cpu2.fields?.bundledCooler);
}

function hasDifferentClock(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.fields?.clock, cpu2.fields?.clock);
}

function hasSameClock(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.clock, cpu2.fields?.clock);
}

function hasDifferentTurboClock(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasDifferentValue(cpu1.fields?.turboClock, cpu2.fields?.turboClock);
}

function hasSameTurboClock(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.turboClock, cpu2.fields?.turboClock);
}

function canOverclockCpu1(comparison: CpuProductComparison) {
  const [cpu1, _cpu2] = comparison;
  return cpu1.fields?.multiplierUnlocked?.value === true;
}

function canOverclockCpu2(comparison: CpuProductComparison) {
  const [_cpu1, cpu2] = comparison;
  return cpu2.fields?.multiplierUnlocked?.value === true;
}

function hasDifferentL1L2Cache(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return (
    hasDifferentValue(cpu1.fields?.l1Cache, cpu2.fields?.l1Cache) &&
    hasDifferentValue(cpu1.fields?.l2Cache, cpu2.fields?.l2Cache)
  );
}

function hasSameL1L2Cache(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return (
    hasSameValue(cpu1.fields?.l1Cache, cpu2.fields?.l1Cache) &&
    hasSameValue(cpu1.fields?.l2Cache, cpu2.fields?.l2Cache)
  );
}

function hasSameMemorySupport(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.memorySupport, cpu2.fields?.memorySupport);
}

function hasSamePciExpress(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.pciExpress, cpu2.fields?.pciExpress);
}

function hasSameTdp(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(cpu1.fields?.tdp, cpu2.fields?.tdp);
}

function hasSamePerformance(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(
    cpu1.fields?.performanceRating,
    cpu2.fields?.performanceRating,
  );
}

function hasSamePerformancePerDollar(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;
  return hasSameValue(
    cpu1.fields?.performancePerMsrp,
    cpu2.fields?.performancePerMsrp,
  );
}

function hasDifferentValue(field1?: CpuField, field2?: CpuField) {
  if (!hasProductFieldRawValue(field1) || !hasProductFieldRawValue(field2)) {
    return false;
  }

  return field1.value !== field2.value;
}

function hasSameValue(field1?: CpuField, field2?: CpuField) {
  if (!hasProductFieldRawValue(field1) || !hasProductFieldRawValue(field2)) {
    return false;
  }

  return field1.value === field2.value;
}
