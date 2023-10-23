import {
  getGpuChipset,
  getListGpusPath,
  LIST_GPUS_PRESETS,
  ProductType,
} from '@pcpartdb/shared';
import { ProductRatingType } from 'packages/website/src/client/product/components/ProductRatingCard/types';
import { ViewProductRatingCard } from 'packages/website/src/client/product/components/ProductRatingCard/ViewProductRatingCard';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const chipset = getGpuChipset(gpu);

  const performanceRankHref = useMemo(() => {
    if (chipset.ranks?.performanceRating) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-performance']);
    }
    return undefined;
  }, [chipset.ranks?.performanceRating]);

  const valueRankHref = useMemo(() => {
    if (chipset.ranks?.performancePerMsrp) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-value']);
    }
    return undefined;
  }, [chipset.ranks?.performancePerMsrp]);

  return (
    <div className={classNames('flex flex-wrap gap-4', className)}>
      <ViewProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.PerformanceRating}
        maxRating={100}
        ratingField={chipset.fields?.performanceRating}
        rank={chipset.ranks?.performanceRating}
        rankHref={performanceRankHref}
      />

      <ViewProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.ValueRating}
        maxRating={100}
        ratingField={chipset.fields?.performancePerMsrp}
        rank={chipset.ranks?.performancePerMsrp}
        rankHref={valueRankHref}
      />
    </div>
  );
};
