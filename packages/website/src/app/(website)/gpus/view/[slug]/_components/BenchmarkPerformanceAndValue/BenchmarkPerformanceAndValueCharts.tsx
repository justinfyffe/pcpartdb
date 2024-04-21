'use client';

import {
  formatProductName,
  getGpuChipset,
  getListGpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  hasBenchmarkPerformanceRank,
  hasBenchmarkValueRank,
  LIST_GPUS_PRESETS,
  ListGpusPresetSlug,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductRatingType } from 'packages/website/src/app/_common/product/components/ProductRatingCard/types';
import { ViewProductRatingCard } from 'packages/website/src/app/_common/product/components/ProductRatingCard/ViewProductRatingCard';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface BenchmarkPerformanceAndValueChartsProps {
  className?: string;
}

export const BenchmarkPerformanceAndValueCharts: FunctionComponent<
  BenchmarkPerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const { viewModel } = useViewModelContext<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const chipset = getGpuChipset(gpu);
  const bestPerformanceGpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformance;
  const bestValueGpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformancePerDollar;


  const name = useMemo(() => {
    return formatProductName(chipset, { company: false, brand: false });
  }, [chipset]);

  const performanceRankHref = useMemo(() => {
    if (hasBenchmarkPerformanceRank(chipset, preferredBenchmark)) {
      return getListGpusPath(
        LIST_GPUS_PRESETS[ListGpusPresetSlug.BestPerformance],
      );
    }
    return undefined;
  }, [chipset, preferredBenchmark]);

  const valueRankHref = useMemo(() => {
    if (hasBenchmarkValueRank(chipset, preferredBenchmark)) {
      return getListGpusPath(
        LIST_GPUS_PRESETS[ListGpusPresetSlug.BestPerformancePerDollar],
      );
    }
    return undefined;
  }, [chipset, preferredBenchmark]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <ViewProductRatingCard
        productType={ProductType.Gpu}
        productId={gpu.id}
        ratingType={ProductRatingType.PerformanceRating}
        name={name}
        maxRating={productBenchmarkValue(
          bestPerformanceGpu,
          preferredBenchmark,
        )}
        rating={productBenchmarkValue(chipset, preferredBenchmark)}
        rank={getProductPerformanceRank(chipset, preferredBenchmark)}
        rankHref={performanceRankHref}
        className="flex-1"
      />

      <ViewProductRatingCard
        productType={ProductType.Gpu}
        productId={gpu.id}
        ratingType={ProductRatingType.ValueRating}
        name={name}
        maxRating={productBenchmarkValuePerMsrp(
          bestValueGpu,
          preferredBenchmark,
        )}
        rating={Number(
          productBenchmarkValuePerMsrp(chipset, preferredBenchmark)?.toFixed(2),
        )}
        rank={getProductValueRank(chipset, preferredBenchmark)}
        rankHref={valueRankHref}
        className="flex-1"
      />
    </div>
  );
};
