import {
  CpuContentData,
  CpuProduct,
  formatGpuDimensions,
  formatOrdinalNumber,
  formatProductName,
  getGpuChipset,
  GpuContentData,
  GpuProduct,
  hasLaunched,
  hasProductFieldRawValue,
  isCpuProduct,
  isGpuProduct,
  isPastLaunchDate,
  Product,
  ProductContentData,
  productFieldFormattedValue,
  productFieldRawValue,
  productRankTotalRanked,
  productRankValue,
  RankKey,
} from '@pcpartdb/shared';
import { ContentParams } from '../../shared/content/types';

export function buildContentParams(
  product: Product,
  contentData: ProductContentData,
) {
  const params: ContentParams = {};

  params['architecture'] = productFieldFormattedValue(
    product?.fields?.architecture,
  );
  params['countPerformanceRanks'] = productRankTotalRanked(
    product,
    RankKey.PerformanceRating,
  );
  params['countPerformanceRanksForMarketSegment'] = productRankTotalRanked(
    product,
    RankKey.PerformanceRatingForMarketSegment,
  );
  params['codename'] = productFieldFormattedValue(product?.fields?.codename);
  params['company'] = product?.company;
  params['foundry'] = productFieldFormattedValue(product?.fields?.foundry);
  params['generation'] = productFieldFormattedValue(
    product?.fields?.generation,
  );
  params['hasLaunched'] = hasLaunched(product);
  params['isPastReleaseDate'] = isPastLaunchDate(product);
  params['marketSegment'] = productFieldFormattedValue(
    product?.fields?.marketSegment,
  )?.toLowerCase();
  params['msrp'] = productFieldFormattedValue(product?.fields?.msrp);
  params['name'] = formatProductName(product);
  params['nameWithNoCompany'] = formatProductName(product, { company: false });
  params['nameWithNoCompanyNoBrand'] = formatProductName(product, {
    company: false,
    brand: false,
  });
  params['performanceRank'] = productRankValue(
    product,
    RankKey.PerformanceRating,
  );
  params['performanceRankOrdinal'] = formatOrdinalNumber(
    productRankValue(product, RankKey.PerformanceRating),
  );
  params['performanceRankForMarketSegment'] = productRankValue(
    product,
    RankKey.PerformanceRatingForMarketSegment,
  );
  params['performanceRating'] = productFieldFormattedValue(
    product?.fields?.performanceRating,
  );
  params['processSize'] = productFieldFormattedValue(
    product?.fields?.processSize,
  );
  params['releaseDate'] = productFieldFormattedValue(
    product?.fields?.releaseDate,
  );
  params['tdp'] = productFieldFormattedValue(product?.fields?.tdp);
  params['transistors'] = productFieldFormattedValue(
    product?.fields?.transistors,
  );
  params['valueRank'] = productRankValue(product, RankKey.PerformancePerMsrp);
  params['valueRankOrdinal'] = formatOrdinalNumber(
    productRankValue(product, RankKey.PerformancePerMsrp),
  );
  params['valueRating'] = productFieldFormattedValue(
    product?.fields?.performancePerMsrp,
  );

  return {
    ...params,
    ...buildCpuContentParams(
      product as CpuProduct,
      contentData as CpuContentData,
    ),
    ...buildGpuContentParams(
      product as GpuProduct,
      contentData as GpuContentData,
    ),
  };
}

function buildCpuContentParams(
  product: CpuProduct,
  additionalData: CpuContentData,
) {
  const params: ContentParams = {};
  if (!isCpuProduct(product)) {
    return {};
  }

  const bestPerformanceDifferencePct =
    hasProductFieldRawValue(product?.fields?.performanceRating) &&
    hasProductFieldRawValue(
      additionalData?.bestPerformanceCpu?.fields?.performanceRating,
    )
      ? (
          100 *
          (productFieldRawValue(product?.fields?.performanceRating) /
            productFieldRawValue(
              additionalData?.bestPerformanceCpu?.fields?.performanceRating,
            ))
        ).toFixed(2)
      : null;

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceCpu,
  );

  params['boostClock'] = productFieldFormattedValue(
    product?.fields?.turboClock,
  );
  params['bundledCooler'] = productFieldFormattedValue(
    product?.fields?.bundledCooler,
  );
  params['clock'] = productFieldFormattedValue(product?.fields?.clock);
  params['cores'] = productFieldRawValue(product?.fields?.cores);
  params['integratedGraphics'] = productFieldFormattedValue(
    product?.fields?.integratedGraphics,
  );
  params['l1Cache'] = productFieldFormattedValue(product?.fields?.l1Cache);
  params['l2Cache'] = productFieldFormattedValue(product?.fields?.l2Cache);
  params['l3Cache'] = productFieldFormattedValue(product?.fields?.l3Cache);
  params['memoryChannels'] = productFieldFormattedValue(
    product?.fields?.memoryChannels,
  );
  params['memorySupport'] = productFieldFormattedValue(
    product?.fields?.memorySupport,
  );
  params['multiplier'] = productFieldFormattedValue(
    product?.fields?.multiplier,
  );
  params['pciExpress'] = productFieldFormattedValue(
    product?.fields?.pciExpress,
  );
  params['pl1'] = productFieldFormattedValue(product?.fields?.pl1);
  params['pl2'] = productFieldFormattedValue(product?.fields?.pl2);
  params['ppt'] = productFieldFormattedValue(product?.fields?.ppt);
  params['productionStatus'] = productFieldFormattedValue(
    product?.fields?.productionStatus,
  )?.toLowerCase();
  params['smp'] = productFieldFormattedValue(product?.fields?.smp);
  params['socket'] = productFieldFormattedValue(product?.fields?.socket);
  params['tCaseMax'] = productFieldFormattedValue(product?.fields?.tCaseMax);
  params['threads'] = productFieldRawValue(product?.fields?.threads);
  params['tjMax'] = productFieldFormattedValue(product?.fields?.tjMax);

  return params;
}

function buildGpuContentParams(
  product: GpuProduct,
  additionalData: GpuContentData,
) {
  const params: ContentParams = {};
  if (!isGpuProduct(product)) {
    return {};
  }

  const chipset = getGpuChipset(product);
  const bestPerformanceDifferencePct =
    hasProductFieldRawValue(product?.fields?.performanceRating) &&
    hasProductFieldRawValue(
      additionalData?.bestPerformanceGpu?.fields?.performanceRating,
    )
      ? (
          100 *
          (productFieldRawValue(chipset?.fields?.performanceRating) /
            productFieldRawValue(
              additionalData?.bestPerformanceGpu?.fields?.performanceRating,
            ))
        ).toFixed(2)
      : null;

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceGpu,
  );

  params['busInterface'] = productFieldFormattedValue(
    product?.fields?.busInterface,
  );
  params['chipsetName'] = formatProductName(chipset);
  params['chipsetNameWithNoCompany'] = formatProductName(chipset, {
    company: false,
  });
  params['computeUnits'] = productFieldFormattedValue(
    product?.fields?.computeUnits,
  );
  params['gpuCores'] = productFieldFormattedValue(product?.fields?.gpuCores);
  params['coreClock'] = productFieldFormattedValue(
    product?.fields?.gpuCoreBaseClock,
  );
  params['coreBoostClock'] = productFieldFormattedValue(
    product?.fields?.gpuCoreBoostClock,
  );
  params['dimensions'] = formatGpuDimensions(product);
  params['foundry'] = productFieldFormattedValue(product?.fields?.foundry);
  params['fp16'] = productFieldFormattedValue(product?.fields?.fp16);
  params['fp32'] = productFieldFormattedValue(product?.fields?.fp32);
  params['fp64'] = productFieldFormattedValue(product?.fields?.fp64);
  params['memoryBandwidth'] = hasProductFieldRawValue(
    product?.fields?.memoryBandwidth,
  )
    ? productFieldFormattedValue(product?.fields?.memoryBandwidth)
    : null;
  params['memoryClock'] = hasProductFieldRawValue(product?.fields?.memoryClock)
    ? productFieldFormattedValue(product?.fields?.memoryClock)
    : null;
  params['memoryClockEffective'] = hasProductFieldRawValue(
    product?.fields?.memoryClockEffective,
  )
    ? productFieldFormattedValue(product?.fields?.memoryClockEffective)
    : null;
  params['memoryInterface'] = hasProductFieldRawValue(
    product?.fields?.memoryInterface,
  )
    ? productFieldFormattedValue(product?.fields?.memoryInterface)
    : null;
  params['memorySize'] = hasProductFieldRawValue(product?.fields?.memorySize)
    ? productFieldFormattedValue(product?.fields?.memorySize)
    : null;
  params['memoryType'] = hasProductFieldRawValue(product?.fields?.memoryType)
    ? productFieldFormattedValue(product?.fields?.memoryType)
    : null;
  params['outputs'] = productFieldFormattedValue(product?.fields?.outputs);
  params['rops'] = productFieldFormattedValue(product?.fields?.rops);
  params['rtCores'] = productFieldFormattedValue(product?.fields?.rtCores);
  params['slotWidth'] = Number(
    productFieldRawValue(product?.fields?.slotWidth),
  );
  params['suggestedPsu'] = productFieldFormattedValue(
    product?.fields?.suggestedPsu,
  );
  params['tensorCores'] = productFieldFormattedValue(
    product?.fields?.tensorCores,
  );
  params['tmus'] = productFieldFormattedValue(product?.fields?.tmus);

  return params;
}
