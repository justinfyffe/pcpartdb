import { GpuComparison } from '@pcpartdb/shared';
import { parse } from 'date-fns';
import { formatGpuField } from '../../../utils';

export enum CompareGpusContentTag {
  SameCompany = 'SAME_COMPANY',
  SameMarketSegment = 'SAME_MARKET_SEGMENT',
  SameReleaseDate = 'SAME_RELEASE_DATE',
  SameReleaseYear = 'SAME_RELEASE_YEAR',
  DifferentBetterPerformanceAndValue = 'DIFFERENT_BETTER_PERFORMANCE_AND_VALUE',
}

export function getContentTags(comparison: GpuComparison) {
  const [gpu1, gpu2] = comparison;

  const sameCompany = gpu1.company?.value === gpu2.company?.value;

  const sameMarketSegment =
    gpu1.marketSegment?.value === gpu2.marketSegment?.value;

  let sameReleaseDate = false;
  let sameReleaseYear = false;
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    const gpu1Year = parse(gpu1.releaseDate.value, 'yyyy-MM-dd', new Date());
    const gpu2Year = parse(gpu2.releaseDate.value, 'yyyy-MM-dd', new Date());
    sameReleaseDate =
      formatGpuField(gpu1.releaseDate) === formatGpuField(gpu2.releaseDate);
    sameReleaseYear = gpu1Year.getUTCFullYear() === gpu2Year.getUTCFullYear();
  }

  let differentBetterPerformanceAndValue = false;
  if (
    gpu1.performanceScore?.value != null &&
    gpu2.performanceScore?.value != null &&
    gpu1.valueScore?.value != null &&
    gpu2.valueScore?.value != null
  ) {
    const performanceScore1 = gpu1.performanceScore?.value;
    const performanceScore2 = gpu2.performanceScore?.value;
    const valueScore1 = gpu1.valueScore?.value;
    const valueScore2 = gpu2.valueScore?.value;
    differentBetterPerformanceAndValue =
      (performanceScore1 > performanceScore2 && valueScore2 > valueScore1) ||
      (performanceScore2 > performanceScore1 && valueScore1 > valueScore2);
  }

  return {
    [CompareGpusContentTag.SameCompany]: sameCompany,
    [CompareGpusContentTag.SameMarketSegment]: sameMarketSegment,
    [CompareGpusContentTag.SameReleaseDate]: sameReleaseDate,
    [CompareGpusContentTag.SameReleaseYear]: sameReleaseYear,
    [CompareGpusContentTag.DifferentBetterPerformanceAndValue]:
      differentBetterPerformanceAndValue,
  };
}
