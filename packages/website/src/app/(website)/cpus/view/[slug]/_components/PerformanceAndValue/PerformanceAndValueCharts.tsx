'use client';

import {
  formatProductName,
  getListCpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  hasBenchmarkPerformanceRank,
  hasBenchmarkValueRank,
  LIST_CPUS_PRESETS,
  ListCpusPresetSlug,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductRatingType } from 'packages/website/src/app/_common/product/components/ProductRatingCard/types';
import { ViewProductRatingCard } from 'packages/website/src/app/_common/product/components/ProductRatingCard/ViewProductRatingCard';
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

  const { viewModel } = useViewModelContext<ViewCpuViewModel>();
  const cpu = viewModel.cpu;
  const bestPerformanceCpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformance;
  const bestValueCpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformancePerDollar;

  const name = useMemo(() => {
    return formatProductName(cpu, { company: false, brand: false });
  }, [cpu]);

  const performanceRankHref = useMemo(() => {
    if (hasBenchmarkPerformanceRank(cpu, preferredBenchmark)) {
      return getListCpusPath(
        LIST_CPUS_PRESETS[ListCpusPresetSlug.BestPerformance],
      );
    }
    return undefined;
  }, [cpu, preferredBenchmark]);

  const valueRankHref = useMemo(() => {
    if (hasBenchmarkValueRank(cpu, preferredBenchmark)) {
      return getListCpusPath(
        LIST_CPUS_PRESETS[ListCpusPresetSlug.BestPerformancePerDollar],
      );
    }
    return undefined;
  }, [cpu, preferredBenchmark]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-6', className)}>
      <ViewProductRatingCard
        productType={ProductType.Cpu}
        productId={cpu.id}
        ratingType={ProductRatingType.PerformanceRating}
        name={name}
        maxRating={productBenchmarkValue(
          bestPerformanceCpu,
          preferredBenchmark,
        )}
        rating={productBenchmarkValue(cpu, preferredBenchmark)}
        rank={getProductPerformanceRank(cpu, preferredBenchmark)}
        rankHref={performanceRankHref}
        className="flex-1"
      />

      <ViewProductRatingCard
        productType={ProductType.Cpu}
        productId={cpu.id}
        ratingType={ProductRatingType.ValueRating}
        name={name}
        maxRating={productBenchmarkValuePerMsrp(
          bestValueCpu,
          preferredBenchmark,
        )}
        rating={Number(
          productBenchmarkValuePerMsrp(cpu, preferredBenchmark)?.toFixed(2),
        )}
        rank={getProductValueRank(cpu, preferredBenchmark)}
        rankHref={valueRankHref}
        className="flex-1"
      />
    </div>
  );
};
