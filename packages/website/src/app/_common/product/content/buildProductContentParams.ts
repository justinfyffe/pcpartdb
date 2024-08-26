'use client';

import {
  BenchmarkKey,
  CpuProduct,
  formatOrdinalNumber,
  formatProductName,
  getProductBenchmarkAbbrev,
  getProductBenchmarkName,
  getProductBenchmarkShortName,
  getProductPerformanceRank,
  getProductPerformanceTotalRanked,
  getProductValueRank,
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
  ProductField,
  productFieldFormattedValue,
  productFieldRawValue,
  RelativeDataProducts,
} from '@pcpartdb/shared';
import { ContentParams } from '../../content/types';

interface BuildContentParamsOptions {
  preferredBenchmark: BenchmarkKey;
  product: Product;
  relativeProducts: RelativeDataProducts;
}

export function buildProductContentParams(options: BuildContentParamsOptions) {
  const { product, relativeProducts, preferredBenchmark } = options;
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
  params['nameWithNoTags'] = formatProductName(product, { tags: false });
  params['nameWithNoCompanyNoBrand'] = formatProductName(product, {
    company: false,
    brand: false,
  });
  params['nameWithNoCompanyNoTags'] = formatProductName(product, {
    company: false,
    tags: false,
  });
  params['nameWithNoCompanyNoBrandNoTags'] = formatProductName(product, {
    company: false,
    brand: false,
    tags: false,
  });
  params['performanceRank'] = getProductPerformanceRank(
    product,
    preferredBenchmark,
  );
  params['performanceRankOrdinal'] = formatOrdinalNumber(
    getProductPerformanceRank(product, preferredBenchmark),
  );
  params['preferredBenchmark'] = preferredBenchmark;
  params['preferredBenchmarkName'] =
    getProductBenchmarkName(preferredBenchmark);
  params['preferredBenchmarkShortName'] =
    getProductBenchmarkShortName(preferredBenchmark);
  params['preferredBenchmarkAbbrev'] =
    getProductBenchmarkAbbrev(preferredBenchmark);

  params['preferredBenchmarkPerformance'] = productBenchmarkValue(
    product,
    preferredBenchmark,
  )?.toLocaleString('en-US', { maximumFractionDigits: 2 });
  params['processSize'] = getFormattedValue(product?.fields?.processSize);
  params['releaseDate'] = getFormattedValue(product?.fields?.releaseDate);
  params['tdp'] = getFormattedValue(product?.fields?.tdp);
  params['transistors'] = getFormattedValue(product?.fields?.transistors);
  params['valueRank'] = getProductValueRank(product, preferredBenchmark);
  params['valueRankOrdinal'] = formatOrdinalNumber(
    getProductValueRank(product, preferredBenchmark),
  );
  params['preferredBenchmarkValuePerMsrp'] = productBenchmarkValuePerMsrp(
    product,
    preferredBenchmark,
  )?.toLocaleString('en-US', { maximumFractionDigits: 2 });

  return {
    ...params,
    ...buildCpuContentParams(
      preferredBenchmark,
      product as CpuProduct,
      relativeProducts,
    ),
    ...buildGpuContentParams(
      preferredBenchmark,
      product as GpuProduct,
      relativeProducts,
    ),
  };
}

function buildCpuContentParams(
  preferredBenchmark: BenchmarkKey,
  product: CpuProduct,
  relativeProducts: RelativeDataProducts,
) {
  const params: ContentParams = {};
  if (!isCpuProduct(product)) {
    return {};
  }

  const bestPerformanceDifferencePct =
    productBenchmarkValue(product, preferredBenchmark) != null &&
    productBenchmarkValue(
      relativeProducts?.bestBenchmarkPerformance,
      preferredBenchmark,
    ) != null
      ? (
          100 *
          (productBenchmarkValue(product, preferredBenchmark) /
            productBenchmarkValue(
              relativeProducts?.bestBenchmarkPerformance,
              preferredBenchmark,
            ))
        ).toFixed(2)
      : null;

  const cores = hasProductFieldRawValue(product?.fields?.cores)
    ? Number(getRawValue(product?.fields?.cores))
    : null;
  const threads = hasProductFieldRawValue(product?.fields?.threads)
    ? Number(getRawValue(product?.fields?.threads))
    : null;

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    relativeProducts?.bestBenchmarkPerformance,
  );

  params['boostClock'] = getFormattedValue(product?.fields?.turboClock);
  params['bundledCooler'] = getFormattedValue(product?.fields?.bundledCooler);
  params['clock'] = getFormattedValue(product?.fields?.clock);
  params['cores'] = cores;
  params['eCores'] = getRawValue(product?.fields?.eCores);
  params['integratedGraphics'] = getFormattedValue(
    product?.fields?.integratedGraphics,
  );
  params['l1Cache'] = getFormattedValue(product?.fields?.l1Cache);
  params['l2Cache'] = getFormattedValue(product?.fields?.l2Cache);
  params['l3Cache'] = getFormattedValue(product?.fields?.l3Cache);
  params['memoryChannels'] = getFormattedValue(
    product?.fields?.memoryChannels,
  )?.toLowerCase();
  params['memoryChannelsRaw'] = productFieldRawValue(
    product?.fields?.memoryChannels,
  );
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
  params['threads'] = threads;
  params['tjMax'] = getFormattedValue(product?.fields?.tjMax);

  params['isMultiCore'] = cores > 1 || null;
  params['isMultiThread'] = threads > 1 || null;
  params['isSingleCore'] = cores === 1 || null;
  params['isSingleThread'] = threads === 1 || null;

  return params;
}

function buildGpuContentParams(
  preferredBenchmark: BenchmarkKey,
  product: GpuProduct,
  relativeProducts: RelativeDataProducts,
) {
  const params: ContentParams = {};
  if (!isGpuProduct(product)) {
    return {};
  }

  const gpu = product;
  const bestPerformanceDifferencePct =
    productBenchmarkValue(gpu, preferredBenchmark) != null &&
    productBenchmarkValue(
      relativeProducts?.bestBenchmarkPerformance,
      preferredBenchmark,
    ) != null
      ? (
          100 *
          (productBenchmarkValue(gpu, preferredBenchmark) /
            productBenchmarkValue(
              relativeProducts?.bestBenchmarkPerformance,
              preferredBenchmark,
            ))
        ).toFixed(2)
      : null;

  const slotWidth = Number(productFieldRawValue(product?.fields?.slotWidth));
  let isVeryLarge = null;
  let isLarge = null;
  let isDualSlot = null;
  let isLowProfile = null;
  let isCompactLowProfile = null;
  if (slotWidth > 3) {
    isVeryLarge = true;
  } else if (slotWidth > 2.5) {
    isLarge = true;
  } else if (slotWidth >= 2) {
    isDualSlot = true;
  } else if (slotWidth >= 1.5) {
    isLowProfile = true;
  } else if (slotWidth < 1.5) {
    isCompactLowProfile = true;
  }

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    relativeProducts?.bestBenchmarkPerformance,
  );

  params['aiAccelerators'] = getFormattedValue(product?.fields?.aiAccelerators);
  params['busInterface'] = getFormattedValue(product?.fields?.busInterface);
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
  params['coreClock'] = getFormattedValue(product?.fields?.gpuCoreBaseClock);
  params['coreBoostClock'] = getFormattedValue(
    product?.fields?.gpuCoreBoostClock,
  );
  params['gpuCoreGameClock'] = getFormattedValue(
    product?.fields?.gpuCoreGameClock,
  );
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
  params['rayAccelerators'] = getFormattedValue(
    product?.fields?.rayAccelerators,
  );
  params['rayTracingUnits'] = getFormattedValue(
    product?.fields?.rayTracingUnits,
  );
  params['rtCores'] = getFormattedValue(product?.fields?.rtCores);
  params['slotWidth'] = slotWidth;
  params['isVeryLarge'] = isVeryLarge;
  params['isLarge'] = isLarge;
  params['isDualSlot'] = isDualSlot;
  params['isLowProfile'] = isLowProfile;
  params['isCompactLowProfile'] = isCompactLowProfile;
  params['suggestedPsu'] = getFormattedValue(product?.fields?.suggestedPsu);
  params['tensorCores'] = getFormattedValue(product?.fields?.tensorCores);
  params['tmus'] = getFormattedValue(product?.fields?.tmus);
  params['xeMatrixExtensions'] = getFormattedValue(
    product?.fields?.xeMatrixExtensions,
  );

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
