import {
  formatProductName,
  getListCpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  LIST_CPUS_PRESETS,
  productBenchmarkValue,
  productBenchmarkValuePerMsrp,
  ProductType,
} from '@pcpartdb/shared';
import { CompareProductRatingCard } from 'packages/website/src/client/product/components/ProductRatingCard/CompareProductRatingCard';
import { ProductRatingType } from 'packages/website/src/client/product/components/ProductRatingCard/types';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { comparison, contentData, updateViewModel } =
    useContext(ComparePageContext);
  const cpu1 = comparison[0];
  const cpu2 = comparison[1];
  const { bestPerformanceCpu, bestValueCpu } = contentData;

  const performanceRankHref = useMemo(
    () => getListCpusPath(LIST_CPUS_PRESETS['best-performance']),
    [],
  );
  const valueRankHref = useMemo(
    () => getListCpusPath(LIST_CPUS_PRESETS['best-value']),
    [],
  );

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(cpu1, { company: false, brand: false }),
      formatProductName(cpu2, { company: false, brand: false }),
    ];
  }, [cpu1, cpu2]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-4', className)}>
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
        onBenchmarkChange={updateViewModel}
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
        onBenchmarkChange={updateViewModel}
      />
    </div>
  );
};
