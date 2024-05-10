'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getListGpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  LIST_GPUS_PRESETS,
  ListGpusPresetSlug,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
} from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { CompareProductRatingCard } from 'packages/website/src/app/_common/product/components/ProductRatingCard/CompareProductRatingCard';
import { ProductRatingType } from 'packages/website/src/app/_common/product/components/ProductRatingCard/types';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);

  const { viewModel } = useViewModelContext<CompareGpusViewModel>();
  const { comparison } = viewModel;
  const gpu1 = comparison[0];
  const gpu2 = comparison[1];
  const bestPerformanceGpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformance;
  const bestValueGpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const performanceRankHref = useMemo(
    () =>
      getListGpusPath(LIST_GPUS_PRESETS[ListGpusPresetSlug.BestPerformance]),
    [],
  );
  const valueRankHref = useMemo(
    () =>
      getListGpusPath(
        LIST_GPUS_PRESETS[ListGpusPresetSlug.BestPerformancePerDollar],
      ),
    [],
  );

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(gpu1, { company: false, brand: false }),
      formatProductName(gpu2, { company: false, brand: false }),
    ];
  }, [gpu1, gpu2]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <CompareProductRatingCard
        productType={ProductType.Gpu}
        productIds={[gpu1.id, gpu2.id]}
        ratingType={ProductRatingType.PerformanceRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValue(
          bestPerformanceGpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValue(gpu1, preferredBenchmark),
          productBenchmarkValue(gpu2, preferredBenchmark),
        ]}
        ranks={[
          getProductPerformanceRank(gpu1, preferredBenchmark),
          getProductPerformanceRank(gpu2, preferredBenchmark),
        ]}
        rankHrefs={[performanceRankHref, performanceRankHref]}
        className="flex-1"
      />

      <CompareProductRatingCard
        productType={ProductType.Gpu}
        productIds={[gpu1.id, gpu2.id]}
        ratingType={ProductRatingType.ValueRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValuePerMsrp(
          bestValueGpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValuePerMsrp(gpu1, preferredBenchmark),
          productBenchmarkValuePerMsrp(gpu2, preferredBenchmark),
        ]}
        ranks={[
          getProductValueRank(gpu1, preferredBenchmark),
          getProductValueRank(gpu2, preferredBenchmark),
        ]}
        rankHrefs={[valueRankHref, valueRankHref]}
        className="flex-1"
      />
    </div>
  );
};
