import {
  formatProductName,
  getGpuChipset,
  getListGpusPath,
  getProductPerformanceRank,
  getProductValueRank,
  hasBenchmarkPerformanceRank,
  hasBenchmarkValueRank,
  LIST_GPUS_PRESETS,
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
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { gpu, contentData, updateViewModel } = useContext(ViewPageContext);
  const chipset = getGpuChipset(gpu);
  const { bestPerformanceGpu, bestValueGpu } = contentData;

  const name = useMemo(() => {
    return formatProductName(chipset, { company: false, brand: false });
  }, [chipset]);

  const performanceRankHref = useMemo(() => {
    if (hasBenchmarkPerformanceRank(chipset, preferredBenchmark)) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-performance']);
    }
    return undefined;
  }, [chipset, preferredBenchmark]);

  const valueRankHref = useMemo(() => {
    if (hasBenchmarkValueRank(chipset, preferredBenchmark)) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-value']);
    }
    return undefined;
  }, [chipset, preferredBenchmark]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-4', className)}>
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
        onBenchmarkChange={updateViewModel}
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
        onBenchmarkChange={updateViewModel}
      />
    </div>
  );
};
