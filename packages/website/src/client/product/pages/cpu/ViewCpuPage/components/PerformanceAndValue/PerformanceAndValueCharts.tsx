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
} from '@pcpartdb/shared';
import { ProductRatingType } from 'packages/website/src/client/product/components/ProductRatingCard/types';
import { ViewProductRatingCard } from 'packages/website/src/client/product/components/ProductRatingCard/ViewProductRatingCard';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { cpu, contentData, updateViewModel } = useContext(ViewPageContext);
  const { bestPerformanceCpu, bestValueCpu } = contentData;

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
        onBenchmarkChange={updateViewModel}
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
        onBenchmarkChange={updateViewModel}
      />
    </div>
  );
};
