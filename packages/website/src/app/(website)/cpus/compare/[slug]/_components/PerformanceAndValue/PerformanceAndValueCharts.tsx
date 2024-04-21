'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getListCpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  LIST_CPUS_PRESETS,
  ListCpusPresetSlug,
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
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { viewModel } = useViewModelContext<CompareCpusViewModel>();
  const { comparison, relativeDataProducts } = viewModel;
  const cpu1 = comparison[0];
  const cpu2 = comparison[1];
  const bestPerformanceCpu = relativeDataProducts?.bestBenchmarkPerformance;
  const bestValueCpu = relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const performanceRankHref = useMemo(
    () =>
      getListCpusPath(LIST_CPUS_PRESETS[ListCpusPresetSlug.BestPerformance]),
    [],
  );
  const valueRankHref = useMemo(
    () =>
      getListCpusPath(
        LIST_CPUS_PRESETS[ListCpusPresetSlug.BestPerformancePerDollar],
      ),
    [],
  );

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(cpu1, { company: false, brand: false }),
      formatProductName(cpu2, { company: false, brand: false }),
    ];
  }, [cpu1, cpu2]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <CompareProductRatingCard
        productType={ProductType.Cpu}
        productIds={[cpu1.id, cpu2.id]}
        ratingType={ProductRatingType.PerformanceRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValue(
          bestPerformanceCpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValue(cpu1, preferredBenchmark),
          productBenchmarkValue(cpu2, preferredBenchmark),
        ]}
        ranks={[
          getProductPerformanceRank(cpu1, preferredBenchmark),
          getProductPerformanceRank(cpu2, preferredBenchmark),
        ]}
        rankHrefs={[performanceRankHref, performanceRankHref]}
        className="flex-1"
      />

      <CompareProductRatingCard
        productType={ProductType.Cpu}
        productIds={[cpu1.id, cpu2.id]}
        ratingType={ProductRatingType.ValueRating}
        names={[name1, name2]}
        maxRating={productBenchmarkValuePerMsrp(
          bestValueCpu,
          preferredBenchmark,
        )}
        ratings={[
          productBenchmarkValuePerMsrp(cpu1, preferredBenchmark),
          productBenchmarkValuePerMsrp(cpu2, preferredBenchmark),
        ]}
        ranks={[
          getProductValueRank(cpu1, preferredBenchmark),
          getProductValueRank(cpu2, preferredBenchmark),
        ]}
        rankHrefs={[valueRankHref, valueRankHref]}
        className="flex-1"
      />
    </div>
  );
};
