import {
  CpuComparison,
  hasProductFieldValue,
  isPastCpuLaunchDate,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';
import { formatCpuField, formatCpuName } from '../../../../utils/cpuUtils';

export interface CompareCpusContentParams {
  company1?: string;
  company2?: string;
  cpuName1?: string;
  cpuName2?: string;
  shortCpuName1?: string;
  shortCpuName2?: string;
  shortestCpuName1?: string;
  shortestCpuName2?: string;
  marketSegment1?: string;
  marketSegment2?: string;
  cpu1NewerOrOlder?: string;
  cpu2WillReleaseOrWasReleased?: string;
  releaseDate1?: string;
  releaseDate2?: string;
  cpu1LaunchPriceHigherOrLower?: string;
  launchPrice1?: string;
  launchPrice2?: string;
  architecture1?: string;
  architecture2?: string;
  generation1?: string;
  generation2?: string;
  socket1?: string;
  socket2?: string;
  integratedGraphics1?: string;
  integratedGraphics2?: string;
  bundledCooler1?: string;
  bundledCooler2?: string;
  clock1?: string;
  clock2?: string;
  turboClock1?: string;
  turboClock2?: string;
  l1Cache1?: string;
  l1Cache2?: string;
  l2Cache1?: string;
  l2Cache2?: string;
  memorySupport1?: string;
  memorySupport2?: string;
  pciExpress1?: string;
  pciExpress2?: string;
  tdp1?: string;
  tdp2?: string;
  cpu1PerformanceMoreOrLess?: string;
  cpu1PerformanceHigherOrLower?: string;
  cpu1PerformanceDifferencePct?: string;
  cpu1ValueHigherOrLower?: string;
  performancePerDollar1?: string;
  performancePerDollar2?: string;
}

export function getContentParams(comparison: CpuComparison) {
  return {
    ...getGeneralParams(comparison),
  } as CompareCpusContentParams as ContentParams;
}

function getGeneralParams(comparison: CpuComparison) {
  const [cpu1, cpu2] = comparison;

  let cpu1NewerOrOlder: string;
  if (
    hasProductFieldValue(cpu1.releaseDate) &&
    hasProductFieldValue(cpu2.releaseDate)
  ) {
    if (cpu1.releaseDate?.value > cpu2.releaseDate?.value) {
      cpu1NewerOrOlder = 'newer';
    } else if (cpu1.releaseDate?.value < cpu2.releaseDate?.value) {
      cpu1NewerOrOlder = 'older';
    }
  }

  let cpu2WillReleaseOrWasReleased: string;
  if (isPastCpuLaunchDate(cpu2)) {
    cpu2WillReleaseOrWasReleased = 'was released';
  } else {
    cpu2WillReleaseOrWasReleased = 'will release';
  }

  let cpu1LaunchPriceHigherOrLower: string;
  if (
    hasProductFieldValue(cpu1.launchPrice) &&
    hasProductFieldValue(cpu2.launchPrice)
  ) {
    if (cpu1.launchPrice?.value > cpu2.launchPrice?.value) {
      cpu1LaunchPriceHigherOrLower = 'higher';
    } else if (cpu1.launchPrice?.value < cpu2.launchPrice?.value) {
      cpu1LaunchPriceHigherOrLower = 'lower';
    }
  }

  let cpu1PerformanceMoreOrLess: string;
  let cpu1PerformanceHigherOrLower: string;
  let cpu1PerformanceDifferencePct: string;
  if (
    hasProductFieldValue(cpu1.performanceScore) &&
    hasProductFieldValue(cpu2.performanceScore)
  ) {
    const performanceScore1 = cpu1.performanceScore.value;
    const performanceScore2 = cpu2.performanceScore.value;
    if (performanceScore1 > performanceScore2) {
      cpu1PerformanceMoreOrLess = 'more';
      cpu1PerformanceHigherOrLower = 'higher';
      cpu1PerformanceDifferencePct =
        ((performanceScore1 / performanceScore2 - 1) * 100).toFixed(0) + '%';
    } else if (performanceScore1 < performanceScore2) {
      cpu1PerformanceMoreOrLess = 'less';
      cpu1PerformanceHigherOrLower = 'lower';
      cpu1PerformanceDifferencePct =
        ((1 - performanceScore1 / performanceScore2) * 100).toFixed(0) + '%';
    }
  }

  let cpu1ValueHigherOrLower: string;
  if (
    hasProductFieldValue(cpu1.valueScore) &&
    hasProductFieldValue(cpu2.valueScore)
  ) {
    const valueScore1 = cpu1.valueScore.value;
    const valueScore2 = cpu2.valueScore.value;
    if (valueScore1 > valueScore2) {
      cpu1ValueHigherOrLower = 'higher';
    } else if (valueScore1 < valueScore2) {
      cpu1ValueHigherOrLower = 'lower';
    }
  }

  return {
    company1: formatCpuField(cpu1.company) || null,
    company2: formatCpuField(cpu2.company) || null,
    cpuName1: formatCpuName(cpu1),
    cpuName2: formatCpuName(cpu2),
    shortCpuName1: formatCpuName(cpu1, { company: false }),
    shortCpuName2: formatCpuName(cpu2, { company: false }),
    shortestCpuName1: formatCpuName(cpu1, { company: false, brand: false }),
    shortestCpuName2: formatCpuName(cpu2, { company: false, brand: false }),
    marketSegment1: formatCpuField(cpu1.marketSegments)?.toLowerCase(),
    marketSegment2: formatCpuField(cpu2.marketSegments)?.toLowerCase(),
    cpu1NewerOrOlder,
    cpu2WillReleaseOrWasReleased,
    releaseDate1: formatCpuField(cpu1.releaseDate) || null,
    releaseDate2: formatCpuField(cpu2.releaseDate) || null,
    cpu1LaunchPriceHigherOrLower,
    launchPrice1: formatCpuField(cpu1.launchPrice) || null,
    launchPrice2: formatCpuField(cpu2.launchPrice) || null,
    coresCount1: formatCpuField(cpu1.coresCount) || null,
    coresCount2: formatCpuField(cpu2.coresCount) || null,
    threadsCount1: formatCpuField(cpu1.threadsCount) || null,
    threadsCount2: formatCpuField(cpu2.threadsCount) || null,
    architecture1: formatCpuField(cpu1.architecture) || null,
    architecture2: formatCpuField(cpu2.architecture) || null,
    generation1: formatCpuField(cpu1.generation) || null,
    generation2: formatCpuField(cpu2.generation) || null,
    socket1: formatCpuField(cpu1.socket) || null,
    socket2: formatCpuField(cpu2.socket) || null,
    integratedGraphics1: formatCpuField(cpu1.integratedGraphics) || null,
    integratedGraphics2: formatCpuField(cpu2.integratedGraphics) || null,
    bundledCooler1: formatCpuField(cpu1.bundledCooler) || null,
    bundledCooler2: formatCpuField(cpu2.bundledCooler) || null,
    clock1: formatCpuField(cpu1.clock) || null,
    clock2: formatCpuField(cpu2.clock) || null,
    turboClock1: formatCpuField(cpu1.turboClock) || null,
    turboClock2: formatCpuField(cpu2.turboClock) || null,
    l1Cache1: formatCpuField(cpu1.l1Cache) || null,
    l1Cache2: formatCpuField(cpu2.l1Cache) || null,
    l2Cache1: formatCpuField(cpu1.l2Cache) || null,
    l2Cache2: formatCpuField(cpu2.l2Cache) || null,
    memorySupport1: formatCpuField(cpu1.memorySupport) || null,
    memorySupport2: formatCpuField(cpu2.memorySupport) || null,
    pciExpress1: formatCpuField(cpu1.pciExpress) || null,
    pciExpress2: formatCpuField(cpu2.pciExpress) || null,
    tdp1: formatCpuField(cpu1.tdp) || null,
    tdp2: formatCpuField(cpu2.tdp) || null,
    cpu1PerformanceMoreOrLess,
    cpu1PerformanceHigherOrLower,
    cpu1PerformanceDifferencePct,
    cpu1ValueHigherOrLower,
    performancePerDollar1: formatCpuField(cpu1.valueScore) || null,
    performancePerDollar2: formatCpuField(cpu2.valueScore) || null,
  } as CompareCpusContentParams as ContentParams;
}
