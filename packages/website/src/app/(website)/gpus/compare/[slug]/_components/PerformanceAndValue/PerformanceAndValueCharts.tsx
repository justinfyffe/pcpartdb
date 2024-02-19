'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
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
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
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

  const { viewModel, updateViewModel } =
    useViewModelContext<CompareGpusViewModel>();
  const { comparison, contentData } = viewModel;
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);
  const { bestPerformanceGpu, bestValueGpu } = contentData;

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
      formatProductName(chipset1, { company: false, brand: false }),
      formatProductName(chipset2, { company: false, brand: false }),
    ];
  }, [chipset1, chipset2]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <CompareProductRatingCard
        productType={ProductType.Gpu}
        productIds={[chipset1.id, chipset2.id]}
        ratingType={ProductRatingType.PerformanceRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValue(
          bestPerformanceGpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValue(chipset1, preferredBenchmark),
          productBenchmarkValue(chipset2, preferredBenchmark),
        ]}
        ranks={[
          getProductPerformanceRank(chipset1, preferredBenchmark),
          getProductPerformanceRank(chipset2, preferredBenchmark),
        ]}
        rankHrefs={[performanceRankHref, performanceRankHref]}
        className="flex-1"
        onBenchmarkChange={updateViewModel}
      />

      <CompareProductRatingCard
        productType={ProductType.Gpu}
        productIds={[chipset1.id, chipset2.id]}
        ratingType={ProductRatingType.ValueRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValuePerMsrp(
          bestValueGpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValuePerMsrp(chipset1, preferredBenchmark),
          productBenchmarkValuePerMsrp(chipset2, preferredBenchmark),
        ]}
        ranks={[
          getProductValueRank(chipset1, preferredBenchmark),
          getProductValueRank(chipset2, preferredBenchmark),
        ]}
        rankHrefs={[valueRankHref, valueRankHref]}
        className="flex-1"
        onBenchmarkChange={updateViewModel}
      />
    </div>
  );
};
