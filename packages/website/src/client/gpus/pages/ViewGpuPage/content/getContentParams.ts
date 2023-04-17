import { getViewGpuPath, Gpu, ViewGpuContentData } from '@pcpartdb/shared';
import {
  DateFormatter,
  formatOrdinalNumber,
} from 'packages/website/src/client/shared/format';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '../../../utils';

export function getContentParams(gpu: Gpu, contentData: ViewGpuContentData) {
  const architecture = formatGpuField(gpu.architecture);
  const codename = formatGpuField(gpu.codename);
  const company = formatGpuField(gpu.company);
  const dimensions = formatGpuDimensions(gpu, { allowMissingDimensions: true });
  const gpuName = getGpuName(gpu);
  const height = formatGpuField(gpu.height);
  const launchPrice = formatGpuField(gpu.launchPrice);
  const launchWindow = formatGpuField(gpu.releaseDate);
  const marketSegment = formatGpuField(gpu.marketSegment)?.toLowerCase();
  const processSize = formatGpuField(gpu.processSize);
  const psu = formatGpuField(gpu.suggestedPsu);
  const releaseDate = formatGpuField(gpu.releaseDate);
  const shortGpuName = getGpuName(gpu, { company: false });
  const slotWidth = formatGpuField(gpu.slotWidth);
  const slotWidthNoUnits = formatGpuField(gpu.slotWidth, { showUnits: false });
  const slotWidthUnits = gpu.slotWidth?.value === 1 ? 'slot' : 'slots';
  const tdp = formatGpuField(gpu.thermalDesignPower);
  const year = formatGpuField(gpu.releaseDate, {
    dateFormatter: DateFormatter.Year,
  });

  const bestPerformanceSegmentGpu = contentData.bestPerformanceGpuForSegment;
  const bestPerformanceDifference = (
    100 *
    (gpu.performanceScore?.value /
      bestPerformanceSegmentGpu?.performanceScore?.value)
  ).toFixed(2);

  const performanceRating = formatGpuField(gpu.performanceScore);
  const performanceRank =
    gpu.ranks?.performanceRank > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRank)
      : '';
  const bestPerformanceSegmentGpuName = getGpuName(bestPerformanceSegmentGpu);
  const performanceRankForArchitectureSegment =
    gpu.ranks?.performanceRankForArchitectureSegment > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRankForArchitectureSegment)
      : '';
  const bestPerformanceSegmentGpuPath =
    bestPerformanceSegmentGpu != null
      ? getViewGpuPath(bestPerformanceSegmentGpu)
      : null;
  const performanceRankForCompanySegment =
    gpu.ranks?.performanceRankForCompanySegment > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRankForCompanySegment)
      : '';
  const performanceRankForSegmentYear =
    gpu.ranks?.performanceRankForSegmentYear > 1
      ? formatOrdinalNumber(gpu.ranks?.performanceRankForSegmentYear)
      : '';
  const totalPerformanceGpus = contentData.totalPerformanceGpus;
  const totalPerformanceSegmentYearGpus =
    contentData.totalPerformanceSegmentYearGpus;

  const valueRating = formatGpuField(gpu.valueScore);
  const valueRank =
    gpu.ranks?.valueRank > 1 ? formatOrdinalNumber(gpu.ranks?.valueRank) : '';
  const valueRankForSegment =
    gpu.ranks?.valueRankForSegment > 1
      ? formatOrdinalNumber(gpu.ranks?.valueRankForSegment)
      : '';

  return {
    architecture,
    codename,
    company,
    dimensions,
    gpuName,
    height,
    launchPrice,
    launchWindow,
    marketSegment,
    processSize,
    psu,
    releaseDate,
    shortGpuName,
    slotWidth,
    slotWidthNoUnits,
    slotWidthUnits,
    tdp,
    year,

    performanceRating,
    performanceRank,
    bestPerformanceDifference,
    bestPerformanceSegmentGpuName,
    bestPerformanceSegmentGpuPath,
    performanceRankForArchitectureSegment,
    performanceRankForCompanySegment,
    performanceRankForSegmentYear,
    totalPerformanceGpus,
    totalPerformanceSegmentYearGpus,

    valueRating,
    valueRank,
    valueRankForSegment,
  };
}
