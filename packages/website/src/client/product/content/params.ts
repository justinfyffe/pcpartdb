import {
  BenchmarkKey,
  CpuContentData,
  CpuProduct,
  formatGpuDimensions,
  formatOrdinalNumber,
  formatProductName,
  getGpuChipset,
  getProductBenchmarkAbbrev,
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  getProductPerformanceRank,
  getProductPerformanceTotalRanked,
  getProductValueRank,
  GpuContentData,
  GpuProduct,
  hasLaunched,
  hasProductFieldFormattedValue,
  hasProductFieldRawValue,
  isCpuProduct,
  isGpuProduct,
  isPastLaunchDate,
  Product,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductContentData,
  ProductField,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ContentParams } from '../../shared/content/types';

interface BuildContentParamsOptions {
  preferredBenchmark: BenchmarkKey;
  product: Product;
  contentData: ProductContentData;
}

export function buildContentParams(options: BuildContentParamsOptions) {
  const { product, contentData, preferredBenchmark } = options;
  const params: ContentParams = {};

  params['architecture'] = getFormattedValue(product?.fields?.architecture);
  params['countPerformanceRanks'] = getProductPerformanceTotalRanked(
    product,
    preferredBenchmark,
  );
  params['codename'] = getFormattedValue(product?.fields?.codename);
  params['company'] = product?.company ?? null;
  params['foundry'] = getFormattedValue(product?.fields?.foundry);
  params['generation'] = getFormattedValue(product?.fields?.generation);
  params['hasLaunched'] = hasLaunched(product);
  params['isPastReleaseDate'] = isPastLaunchDate(product);
  params['marketSegment'] = getFormattedValue(
    product?.fields?.marketSegment,
  )?.toLowerCase();
  params['msrp'] = getFormattedValue(product?.fields?.msrp);
  params['name'] = formatProductName(product);
  params['nameWithNoCompany'] = formatProductName(product, { company: false });
  params['nameWithNoCompanyNoBrand'] = formatProductName(product, {
    company: false,
    brand: false,
  });
  params['performanceRank'] = getProductPerformanceRank(
    product?.parent || product,
    preferredBenchmark,
  );
  params['performanceRankOrdinal'] = formatOrdinalNumber(
    getProductPerformanceRank(product?.parent || product, preferredBenchmark),
  );
  params['preferredBenchmark'] = preferredBenchmark;
  params['preferredBenchmarkName'] =
    getProductBenchmarkName(preferredBenchmark);
  params['preferredBenchmarkShortName'] =
    getProductBenchmarkShortName(preferredBenchmark);
  params['preferredBenchmarkAbbrev'] =
    getProductBenchmarkAbbrev(preferredBenchmark);

  params['preferredBenchmarkPerformance'] = productBenchmarkValue(
    product?.parent || product,
    preferredBenchmark,
  )?.toLocaleString('en-US', { maximumFractionDigits: 2 });
  params['processSize'] = getFormattedValue(product?.fields?.processSize);
  params['releaseDate'] = getFormattedValue(product?.fields?.releaseDate);
  params['tdp'] = getFormattedValue(product?.fields?.tdp);
  params['transistors'] = getFormattedValue(product?.fields?.transistors);
  params['valueRank'] = getProductValueRank(
    product?.parent || product,
    preferredBenchmark,
  );
  params['valueRankOrdinal'] = formatOrdinalNumber(
    getProductValueRank(product?.parent || product, preferredBenchmark),
  );
  params['preferredBenchmarkValuePerMsrp'] = productBenchmarkValuePerMsrp(
    product?.parent || product,
    preferredBenchmark,
  )?.toLocaleString('en-US', { maximumFractionDigits: 2 });

  return {
    ...params,
    ...buildCpuContentParams(
      preferredBenchmark,
      product as CpuProduct,
      contentData as CpuContentData,
    ),
    ...buildGpuContentParams(
      preferredBenchmark,
      product as GpuProduct,
      contentData as GpuContentData,
    ),
  };
}

function buildCpuContentParams(
  preferredBenchmark: BenchmarkKey,
  product: CpuProduct,
  additionalData: CpuContentData,
) {
  const params: ContentParams = {};
  if (!isCpuProduct(product)) {
    return {};
  }

  const bestPerformanceDifferencePct =
    productBenchmarkValue(product, preferredBenchmark) != null &&
    productBenchmarkValue(
      additionalData?.bestPerformanceCpu,
      preferredBenchmark,
    ) != null
      ? (
          100 *
          (productBenchmarkValue(product, preferredBenchmark) /
            productBenchmarkValue(
              additionalData?.bestPerformanceCpu,
              preferredBenchmark,
            ))
        ).toFixed(2)
      : null;

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceCpu,
  );

  params['boostClock'] = getFormattedValue(product?.fields?.turboClock);
  params['bundledCooler'] = getFormattedValue(product?.fields?.bundledCooler);
  params['clock'] = getFormattedValue(product?.fields?.clock);
  params['cores'] = getRawValue(product?.fields?.cores);
  params['eCores'] = getRawValue(product?.fields?.eCores);
  params['integratedGraphics'] = getFormattedValue(
    product?.fields?.integratedGraphics,
  );
  params['l1Cache'] = getFormattedValue(product?.fields?.l1Cache);
  params['l2Cache'] = getFormattedValue(product?.fields?.l2Cache);
  params['l3Cache'] = getFormattedValue(product?.fields?.l3Cache);
  params['memoryChannels'] = getFormattedValue(product?.fields?.memoryChannels);
  params['memorySupport'] = getFormattedValue(product?.fields?.memorySupport);
  params['multiplier'] = getFormattedValue(product?.fields?.multiplier);
  params['pciExpress'] = getFormattedValue(product?.fields?.pciExpress);
  params['pCores'] = getRawValue(product?.fields?.pCores);
  params['pl1'] = getFormattedValue(product?.fields?.pl1);
  params['pl2'] = getFormattedValue(product?.fields?.pl2);
  params['ppt'] = getFormattedValue(product?.fields?.ppt);
  params['productionStatus'] = getFormattedValue(
    product?.fields?.productionStatus,
  )?.toLowerCase();
  params['smp'] = getFormattedValue(product?.fields?.smp);
  params['socket'] = getFormattedValue(product?.fields?.socket);
  params['tCaseMax'] = getFormattedValue(product?.fields?.tCaseMax);
  params['threads'] = getRawValue(product?.fields?.threads);
  params['tjMax'] = getFormattedValue(product?.fields?.tjMax);

  return params;
}

function buildGpuContentParams(
  preferredBenchmark: BenchmarkKey,
  product: GpuProduct,
  additionalData: GpuContentData,
) {
  const params: ContentParams = {};
  if (!isGpuProduct(product)) {
    return {};
  }

  const chipset = getGpuChipset(product);
  const bestPerformanceDifferencePct =
    productBenchmarkValue(chipset, preferredBenchmark) != null &&
    productBenchmarkValue(
      additionalData?.bestPerformanceGpu,
      preferredBenchmark,
    ) != null
      ? (
          100 *
          (productBenchmarkValue(chipset, preferredBenchmark) /
            productBenchmarkValue(
              additionalData?.bestPerformanceGpu,
              preferredBenchmark,
            ))
        ).toFixed(2)
      : null;

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceGpu,
  );

  params['busInterface'] = getFormattedValue(product?.fields?.busInterface);
  params['chipsetName'] = formatProductName(chipset);
  params['chipsetNameWithNoCompany'] = formatProductName(chipset, {
    company: false,
  });
  params['chipsetNameWithNoCompanyNoBrand'] = formatProductName(chipset, {
    company: false,
    brand: false,
  });
  params['computeUnits'] = getFormattedValue(product?.fields?.computeUnits);
  params['executionUnits'] = getFormattedValue(product?.fields?.executionUnits);
  params['streamMultiprocessors'] = getFormattedValue(
    product?.fields?.streamMultiprocessors,
  );
  params['streamProcessors'] = getFormattedValue(
    product?.fields?.streamProcessors,
  );
  params['shadingUnits'] = getFormattedValue(product?.fields?.shadingUnits);
  params['cudaCores'] = getFormattedValue(product?.fields?.cudaCores);
  params['coreClock'] = getFormattedValue(product?.fields?.gpuCoreBaseClock);
  params['coreBoostClock'] = getFormattedValue(
    product?.fields?.gpuCoreBoostClock,
  );
  params['dimensions'] = formatGpuDimensions(product);
  params['foundry'] = getFormattedValue(product?.fields?.foundry);
  params['fp16'] = getFormattedValue(product?.fields?.fp16);
  params['fp32'] = getFormattedValue(product?.fields?.fp32);
  params['fp64'] = getFormattedValue(product?.fields?.fp64);
  params['memoryBandwidth'] = getFormattedValue(
    product?.fields?.memoryBandwidth,
  );
  params['memoryClock'] = getFormattedValue(product?.fields?.memoryClock);
  params['memoryClockEffective'] = getFormattedValue(
    product?.fields?.memoryClockEffective,
  );
  params['memoryInterface'] = getFormattedValue(
    product?.fields?.memoryInterface,
  );
  params['memorySize'] = getFormattedValue(product?.fields?.memorySize);
  params['memoryType'] = getFormattedValue(product?.fields?.memoryType);
  params['outputs'] = getFormattedValue(product?.fields?.outputs);
  params['rops'] = getFormattedValue(product?.fields?.rops);
  params['rtCores'] = getFormattedValue(product?.fields?.rtCores);
  params['slotWidth'] = Number(
    productFieldRawValue(product?.fields?.slotWidth),
  );
  params['suggestedPsu'] = getFormattedValue(product?.fields?.suggestedPsu);
  params['tensorCores'] = getFormattedValue(product?.fields?.tensorCores);
  params['tmus'] = getFormattedValue(product?.fields?.tmus);

  return params;
}

function getFormattedValue(field?: ProductField) {
  if (!hasProductFieldRawValue(field)) {
    return null;
  }

  if (!hasProductFieldFormattedValue(field)) {
    return null;
  }

  return productFieldFormattedValue(field);
}

function getRawValue(field?: ProductField) {
  if (!hasProductFieldRawValue(field)) {
    return null;
  }

  return productFieldRawValue(field);
}
