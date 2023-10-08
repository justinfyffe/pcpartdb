import {
  CpuProductComparison,
  formatCompanyName,
  formatProductName,
  hasProductFieldRawValue,
  isPastCpuLaunchDate,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content/types';

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

export function getContentParams(comparison: CpuProductComparison) {
  return {
    ...getGeneralParams(comparison),
  } as CompareCpusContentParams as ContentParams;
}

function getGeneralParams(comparison: CpuProductComparison) {
  const [cpu1, cpu2] = comparison;

  let cpu1NewerOrOlder: string;
  if (
    hasProductFieldRawValue(cpu1.fields?.releaseDate) &&
    hasProductFieldRawValue(cpu2.fields?.releaseDate)
  ) {
    if (
      productFieldRawValue(cpu1.fields?.releaseDate) >
      productFieldRawValue(cpu2.fields?.releaseDate)
    ) {
      cpu1NewerOrOlder = 'newer';
    } else if (
      productFieldRawValue(cpu1.fields?.releaseDate) <
      productFieldRawValue(cpu2.fields?.releaseDate)
    ) {
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
    hasProductFieldRawValue(cpu1.fields?.msrp) &&
    hasProductFieldRawValue(cpu2.fields?.msrp)
  ) {
    if (
      productFieldRawValue(cpu1.fields?.msrp) >
      productFieldRawValue(cpu2.fields?.msrp)
    ) {
      cpu1LaunchPriceHigherOrLower = 'higher';
    } else if (
      productFieldRawValue(cpu1.fields?.msrp) <
      productFieldRawValue(cpu2.fields?.msrp)
    ) {
      cpu1LaunchPriceHigherOrLower = 'lower';
    }
  }

  let cpu1PerformanceMoreOrLess: string;
  let cpu1PerformanceHigherOrLower: string;
  let cpu1PerformanceDifferencePct: string;
  if (
    hasProductFieldRawValue(cpu1.fields?.performanceRating) &&
    hasProductFieldRawValue(cpu2.fields?.performanceRating)
  ) {
    const performanceScore1 = productFieldRawValue(
      cpu1.fields?.performanceRating,
    );
    const performanceScore2 = productFieldRawValue(
      cpu2.fields?.performanceRating,
    );
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
    hasProductFieldRawValue(cpu1.fields?.performancePerMsrp) &&
    hasProductFieldRawValue(cpu2.fields?.performancePerMsrp)
  ) {
    const valueScore1 = productFieldRawValue(cpu1.fields?.performancePerMsrp);
    const valueScore2 = productFieldRawValue(cpu2.fields?.performancePerMsrp);
    if (valueScore1 > valueScore2) {
      cpu1ValueHigherOrLower = 'higher';
    } else if (valueScore1 < valueScore2) {
      cpu1ValueHigherOrLower = 'lower';
    }
  }

  return {
    company1: formatCompanyName(cpu1.company) || null,
    company2: formatCompanyName(cpu2.company) || null,
    cpuName1: formatProductName(cpu1),
    cpuName2: formatProductName(cpu2),
    shortCpuName1: formatProductName(cpu1, { company: false }),
    shortCpuName2: formatProductName(cpu2, { company: false }),
    shortestCpuName1: formatProductName(cpu1, {
      company: false,
      brand: false,
    }),
    shortestCpuName2: formatProductName(cpu2, {
      company: false,
      brand: false,
    }),
    marketSegment1: hasProductFieldRawValue(cpu1.fields?.marketSegment)
      ? productFieldFormattedValue(cpu1.fields?.marketSegment)?.toLowerCase()
      : null,
    marketSegment2: hasProductFieldRawValue(cpu2.fields?.marketSegment)
      ? productFieldFormattedValue(cpu2.fields?.marketSegment)?.toLowerCase()
      : null,
    cpu1NewerOrOlder,
    cpu2WillReleaseOrWasReleased,
    releaseDate1: hasProductFieldRawValue(cpu1.fields?.releaseDate)
      ? productFieldFormattedValue(cpu1.fields?.releaseDate)
      : null,
    releaseDate2: hasProductFieldRawValue(cpu2.fields?.releaseDate)
      ? productFieldFormattedValue(cpu2.fields?.releaseDate)
      : null,
    cpu1LaunchPriceHigherOrLower,
    launchPrice1: hasProductFieldRawValue(cpu1.fields?.msrp)
      ? productFieldFormattedValue(cpu1.fields?.msrp)
      : null,
    launchPrice2: hasProductFieldRawValue(cpu2.fields?.msrp)
      ? productFieldFormattedValue(cpu2.fields?.msrp)
      : null,
    coresCount1: hasProductFieldRawValue(cpu1.fields?.cores)
      ? productFieldFormattedValue(cpu1.fields?.cores)
      : null,
    coresCount2: hasProductFieldRawValue(cpu2.fields?.cores)
      ? productFieldFormattedValue(cpu2.fields?.cores)
      : null,
    threadsCount1: hasProductFieldRawValue(cpu1.fields?.threads)
      ? productFieldFormattedValue(cpu1.fields?.threads)
      : null,
    threadsCount2: hasProductFieldRawValue(cpu2.fields?.threads)
      ? productFieldFormattedValue(cpu2.fields?.threads)
      : null,
    architecture1: hasProductFieldRawValue(cpu1.fields?.architecture)
      ? productFieldFormattedValue(cpu1.fields?.architecture)
      : null,
    architecture2: hasProductFieldRawValue(cpu2.fields?.architecture)
      ? productFieldFormattedValue(cpu2.fields?.architecture)
      : null,
    generation1: hasProductFieldRawValue(cpu1.fields?.generation)
      ? productFieldFormattedValue(cpu1.fields?.generation)
      : null,
    generation2: hasProductFieldRawValue(cpu2.fields?.generation)
      ? productFieldFormattedValue(cpu2.fields?.generation)
      : null,
    socket1: hasProductFieldRawValue(cpu1.fields?.socket)
      ? productFieldFormattedValue(cpu1.fields?.socket)
      : null,
    socket2: hasProductFieldRawValue(cpu2.fields?.socket)
      ? productFieldFormattedValue(cpu2.fields?.socket)
      : null,
    integratedGraphics1: hasProductFieldRawValue(
      cpu1.fields?.integratedGraphics,
    )
      ? productFieldFormattedValue(cpu1.fields?.integratedGraphics)
      : null,
    integratedGraphics2: hasProductFieldRawValue(
      cpu2.fields?.integratedGraphics,
    )
      ? productFieldFormattedValue(cpu2.fields?.integratedGraphics)
      : null,
    bundledCooler1: hasProductFieldRawValue(cpu1.fields?.bundledCooler)
      ? productFieldFormattedValue(cpu1.fields?.bundledCooler)
      : null,
    bundledCooler2: hasProductFieldRawValue(cpu2.fields?.bundledCooler)
      ? productFieldFormattedValue(cpu2.fields?.bundledCooler)
      : null,
    clock1: hasProductFieldRawValue(cpu1.fields?.clock)
      ? productFieldFormattedValue(cpu1.fields?.clock)
      : null,
    clock2: hasProductFieldRawValue(cpu2.fields?.clock)
      ? productFieldFormattedValue(cpu2.fields?.clock)
      : null,
    turboClock1: hasProductFieldRawValue(cpu1.fields?.turboClock)
      ? productFieldFormattedValue(cpu1.fields?.turboClock)
      : null,
    turboClock2: hasProductFieldRawValue(cpu2.fields?.turboClock)
      ? productFieldFormattedValue(cpu2.fields?.turboClock)
      : null,
    l1Cache1: hasProductFieldRawValue(cpu1.fields?.l1Cache)
      ? productFieldFormattedValue(cpu1.fields?.l1Cache)
      : null,
    l1Cache2: hasProductFieldRawValue(cpu2.fields?.l1Cache)
      ? productFieldFormattedValue(cpu2.fields?.l1Cache)
      : null,
    l2Cache1: hasProductFieldRawValue(cpu1.fields?.l2Cache)
      ? productFieldFormattedValue(cpu1.fields?.l2Cache)
      : null,
    l2Cache2: hasProductFieldRawValue(cpu2.fields?.l2Cache)
      ? productFieldFormattedValue(cpu2.fields?.l2Cache)
      : null,
    memorySupport1: hasProductFieldRawValue(cpu1.fields?.memorySupport)
      ? productFieldFormattedValue(cpu1.fields?.memorySupport)
      : null,
    memorySupport2: hasProductFieldRawValue(cpu2.fields?.memorySupport)
      ? productFieldFormattedValue(cpu2.fields?.memorySupport)
      : null,
    pciExpress1: hasProductFieldRawValue(cpu1.fields?.pciExpress)
      ? productFieldFormattedValue(cpu1.fields?.pciExpress)
      : null,
    pciExpress2: hasProductFieldRawValue(cpu2.fields?.pciExpress)
      ? productFieldFormattedValue(cpu2.fields?.pciExpress)
      : null,
    tdp1: hasProductFieldRawValue(cpu1.fields?.tdp)
      ? productFieldFormattedValue(cpu1.fields?.tdp)
      : null,
    tdp2: hasProductFieldRawValue(cpu2.fields?.tdp)
      ? productFieldFormattedValue(cpu2.fields?.tdp)
      : null,
    cpu1PerformanceMoreOrLess,
    cpu1PerformanceHigherOrLower,
    cpu1PerformanceDifferencePct,
    cpu1ValueHigherOrLower,
    performancePerDollar1: hasProductFieldRawValue(
      cpu1.fields?.performancePerMsrp,
    )
      ? productFieldFormattedValue(cpu1.fields?.performancePerMsrp)
      : null,
    performancePerDollar2: hasProductFieldRawValue(
      cpu2.fields?.performancePerMsrp,
    )
      ? productFieldFormattedValue(cpu2.fields?.performancePerMsrp)
      : null,
  } as CompareCpusContentParams as ContentParams;
}
