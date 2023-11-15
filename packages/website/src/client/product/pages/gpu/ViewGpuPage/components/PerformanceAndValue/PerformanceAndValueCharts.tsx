import {
  formatProductName,
  getGpuChipset,
  getListGpusPath,
  hasProductRank,
  LIST_GPUS_PRESETS,
  productRankValue,
  ProductType,
  RankKey,
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

  const name = useMemo(() => {
    return formatProductName(chipset, { company: false, brand: false });
  }, [chipset]);

  const performanceRankHref = useMemo(() => {
    if (hasProductRank(chipset, RankKey.PerformanceRating)) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-performance']);
    }
    return undefined;
  }, [chipset]);

  const valueRankHref = useMemo(() => {
    if (hasProductRank(chipset, RankKey.PerformancePerMsrp)) {
      return getListGpusPath(LIST_GPUS_PRESETS['best-value']);
    }
    return undefined;
  }, [chipset]);

  return (
    <div className={classNames('flex flex-wrap gap-8', className)}>
      <ViewProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.PerformanceRating}
        name={name}
        maxRating={100}
        ratingField={chipset.fields?.performanceRating}
        rank={productRankValue(chipset, RankKey.PerformanceRating)}
        rankHref={performanceRankHref}
      />

      <ViewProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.ValueRating}
        name={name}
        maxRating={100}
        ratingField={chipset.fields?.performancePerMsrp}
        rank={productRankValue(chipset, RankKey.PerformancePerMsrp)}
        rankHref={valueRankHref}
      />
    </div>
  );
};
