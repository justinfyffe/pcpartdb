import { CompareGpusContentData, GpuComparison } from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content';
import { DateFormatter } from 'packages/website/src/client/shared/format';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
  getShoppingUrl,
} from '../../../utils';

export interface CompareGpusContentParams {
  company1?: string;
  company2?: string;
  gpuName1?: string;
  gpuName2?: string;
  marketSegment1?: string;
  marketSegment2?: string;
  releaseDate1?: string;
  releaseDate2?: string;
  shoppingUrl1?: string;
  shoppingUrl2?: string;
  shortGpuName1?: string;
  shortGpuName2?: string;
  year1?: string;
  year2?: string;
  newerShortGpuName?: string;
  olderShortGpuName?: string;
  newerReleaseDate?: string;
  olderReleaseDate?: string;
  fasterShortGpuName?: string;
  slowerShortGpuName?: string;
  fasterPerformanceFactor?: string;
  higherValueShortGpuName?: string;
  lowerValueShortGpuName?: string;
  betterValueFactor?: string;
  slotWidth1?: string;
  slotWidth2?: string;
  length1?: string;
  length2?: string;
  dimensions1?: string;
  dimensions2?: string;
}

export function getContentParams(
  comparison: GpuComparison,
  contentData: CompareGpusContentData,
) {
  const [gpu1, gpu2] = comparison;

  const company1 = formatGpuField(gpu1.company);
  const company2 = formatGpuField(gpu2.company);
  const gpuName1 = getGpuName(gpu1);
  const gpuName2 = getGpuName(gpu2);
  const marketSegment1 = formatGpuField(gpu1.marketSegment)?.toLowerCase();
  const marketSegment2 = formatGpuField(gpu2.marketSegment)?.toLowerCase();
  const shoppingUrl1 = getShoppingUrl(gpu1);
  const shoppingUrl2 = getShoppingUrl(gpu2);
  const shortGpuName1 = getGpuName(gpu1, { company: false });
  const shortGpuName2 = getGpuName(gpu2, { company: false });
  const releaseDate1 = formatGpuField(gpu1.releaseDate);
  const releaseDate2 = formatGpuField(gpu2.releaseDate);
  const year1 = formatGpuField(gpu1.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });
  const year2 = formatGpuField(gpu2.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });

  let newerShortGpuName: string,
    olderShortGpuName: string,
    newerReleaseDate: string,
    olderReleaseDate: string;
  // Can only have newer and older gpus if both have different release dates.
  if (gpu1.releaseDate?.value != null && gpu2.releaseDate?.value != null) {
    const releaseDateCmp = gpu1.releaseDate.value.localeCompare(
      gpu2.releaseDate.value,
    );
    if (releaseDateCmp < 0) {
      olderShortGpuName = getGpuName(gpu1, { company: false });
      olderReleaseDate = formatGpuField(gpu1.releaseDate);
      newerShortGpuName = getGpuName(gpu2, { company: false });
      newerReleaseDate = formatGpuField(gpu2.releaseDate);
    } else if (releaseDateCmp > 0) {
      newerShortGpuName = getGpuName(gpu1, { company: false });
      newerReleaseDate = formatGpuField(gpu1.releaseDate);
      olderShortGpuName = getGpuName(gpu2, { company: false });
      olderReleaseDate = formatGpuField(gpu2.releaseDate);
    }
  }

  let fasterShortGpuName: string,
    slowerShortGpuName: string,
    fasterPerformanceFactor: string;
  if (
    gpu1.performanceScore?.value != null &&
    gpu2.performanceScore?.value != null
  ) {
    const performanceScore1 = gpu1.performanceScore?.value;
    const performanceScore2 = gpu2.performanceScore?.value;
    if (performanceScore1 > performanceScore2) {
      fasterShortGpuName = getGpuName(gpu1, { company: false });
      slowerShortGpuName = getGpuName(gpu2, { company: false });
      fasterPerformanceFactor =
        ((performanceScore1 / performanceScore2 - 1) * 100).toFixed(2) + '%';
    } else if (performanceScore1 < performanceScore2) {
      slowerShortGpuName = getGpuName(gpu1, { company: false });
      fasterShortGpuName = getGpuName(gpu2, { company: false });
      fasterPerformanceFactor =
        ((performanceScore2 / performanceScore1 - 1) * 100).toFixed(2) + '%';
    }
  }

  let higherValueShortGpuName: string,
    lowerValueShortGpuName: string,
    betterValueFactor: string;
  if (gpu1.valueScore?.value != null && gpu2.valueScore?.value != null) {
    const valueScore1 = gpu1.valueScore?.value;
    const valueScore2 = gpu2.valueScore?.value;
    if (valueScore1 > valueScore2) {
      higherValueShortGpuName = getGpuName(gpu1, { company: false });
      lowerValueShortGpuName = getGpuName(gpu2, { company: false });
      betterValueFactor =
        ((valueScore1 / valueScore2 - 1) * 100).toFixed(2) + '%';
    } else if (valueScore1 < valueScore2) {
      lowerValueShortGpuName = getGpuName(gpu1, { company: false });
      higherValueShortGpuName = getGpuName(gpu2, { company: false });
      betterValueFactor =
        ((valueScore2 / valueScore1 - 1) * 100).toFixed(2) + '%';
    }
  }

  const slotWidth1 = formatGpuField(gpu1.slotWidth, { showUnits: false });
  const slotWidth2 = formatGpuField(gpu2.slotWidth, { showUnits: false });
  const length1 = formatGpuField(gpu1.length);
  const length2 = formatGpuField(gpu2.length);
  const dimensions1 = formatGpuDimensions(gpu1, {
    allowMissingDimensions: false,
  });
  const dimensions2 = formatGpuDimensions(gpu2, {
    allowMissingDimensions: false,
  });

  return {
    company1,
    company2,
    gpuName1,
    gpuName2,
    marketSegment1,
    marketSegment2,
    shoppingUrl1,
    shoppingUrl2,
    shortGpuName1,
    shortGpuName2,
    releaseDate1,
    releaseDate2,
    year1,
    year2,
    newerShortGpuName,
    olderShortGpuName,
    newerReleaseDate,
    olderReleaseDate,
    fasterShortGpuName,
    slowerShortGpuName,
    fasterPerformanceFactor,
    higherValueShortGpuName,
    lowerValueShortGpuName,
    betterValueFactor,
    slotWidth1,
    slotWidth2,
    length1,
    length2,
    dimensions1,
    dimensions2,
  } as CompareGpusContentParams as ContentParams;
}
