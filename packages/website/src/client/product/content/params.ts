import {
  CpuContentData,
  CpuProduct,
  formatGpuDimensions,
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
    product.fields.architecture,
  );
  params['countPerformanceRanks'] = productRankTotalRanked(
    product,
    RankKey.PerformanceRating,
  );
  params['countPerformanceRanksForMarketSegment'] = productRankTotalRanked(
    product,
    RankKey.PerformanceRatingForMarketSegment,
  );
  params['codename'] = productFieldFormattedValue(product.fields.codename);
  params['company'] = product.company;
  params['hasLaunched'] = hasLaunched(product);
  params['isPastReleaseDate'] = isPastLaunchDate(product);
  params['marketSegment'] = productFieldFormattedValue(
    product.fields.marketSegment,
  ).toLowerCase();
  params['msrp'] = productFieldFormattedValue(product.fields.msrp);
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
  params['performanceRankForMarketSegment'] = productRankValue(
    product,
    RankKey.PerformanceRatingForMarketSegment,
  );
  params['performanceRating'] = productFieldFormattedValue(
    product.fields.performanceRating,
  );
  params['processSize'] = productFieldFormattedValue(
    product.fields.processSize,
  );
  params['releaseDate'] = productFieldFormattedValue(
    product.fields.releaseDate,
  );
  params['tdp'] = productFieldFormattedValue(product.fields.tdp);
  params['valueRank'] = productRankValue(product, RankKey.PerformancePerMsrp);
  params['valueRating'] = productFieldFormattedValue(
    product.fields.performancePerMsrp,
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

  const bestPerformanceDifferencePct = (
    100 *
    (productFieldRawValue(product?.fields?.performanceRating) /
      productFieldRawValue(
        additionalData?.bestPerformanceCpu?.fields?.performanceRating,
      ))
  ).toFixed(2);

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceCpu,
  );

  params['boostClock'] = productFieldFormattedValue(product.fields.turboClock);
  params['bundledCooler'] = productFieldFormattedValue(
    product.fields.bundledCooler,
  );
  params['clock'] = productFieldFormattedValue(product.fields.clock);
  params['cores'] = productFieldRawValue(product.fields.cores);
  params['foundry'] = productFieldFormattedValue(product.fields.foundry);
  params['generation'] = productFieldFormattedValue(product.fields.generation);
  params['integratedGraphics'] = productFieldFormattedValue(
    product.fields.integratedGraphics,
  );
  params['l1Cache'] = productFieldFormattedValue(product.fields.l1Cache);
  params['l2Cache'] = productFieldFormattedValue(product.fields.l2Cache);
  params['l3Cache'] = productFieldFormattedValue(product.fields.l3Cache);
  params['memoryChannels'] = productFieldFormattedValue(
    product.fields.memoryChannels,
  );
  params['memorySupport'] = productFieldFormattedValue(
    product.fields.memorySupport,
  );
  params['pciExpress'] = productFieldFormattedValue(product.fields.pciExpress);
  params['socket'] = productFieldFormattedValue(product.fields.socket);
  params['threads'] = productFieldRawValue(product.fields.threads);

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
  const bestPerformanceDifferencePct = (
    100 *
    (productFieldRawValue(chipset?.fields?.performanceRating) /
      productFieldRawValue(
        additionalData?.bestPerformanceGpu?.fields?.performanceRating,
      ))
  ).toFixed(2);

  params['bestPerformanceDifferencePct'] = bestPerformanceDifferencePct;
  params['bestPerformanceName'] = formatProductName(
    additionalData?.bestPerformanceGpu,
  );

  params['chipsetName'] = formatProductName(chipset);
  params['chipsetNameWithNoCompany'] = formatProductName(chipset, {
    company: false,
  });
  params['dimensions'] = formatGpuDimensions(product);
  params['memoryBandwidth'] = hasProductFieldRawValue(
    product.fields.memoryBandwidth,
  )
    ? productFieldFormattedValue(product.fields.memoryBandwidth)
    : null;
  params['memoryClock'] = hasProductFieldRawValue(product.fields.memoryClock)
    ? productFieldFormattedValue(product.fields.memoryClock)
    : null;
  params['memoryInterface'] = hasProductFieldRawValue(
    product.fields.memoryInterface,
  )
    ? productFieldFormattedValue(product.fields.memoryInterface)
    : null;
  params['memorySize'] = hasProductFieldRawValue(product.fields.memorySize)
    ? productFieldFormattedValue(product.fields.memorySize)
    : null;
  params['memoryType'] = hasProductFieldRawValue(product.fields.memoryType)
    ? productFieldFormattedValue(product.fields.memoryType)
    : null;
  params['outputs'] = productFieldFormattedValue(product.fields.outputs);
  params['slotWidth'] = Number(productFieldRawValue(product.fields.slotWidth));
  params['suggestedPsu'] = productFieldFormattedValue(
    product.fields.suggestedPsu,
  );

  return params;
}
