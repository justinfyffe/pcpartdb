import {
  formatProductName,
  getListCpusPath,
  hasProductRank,
  LIST_CPUS_PRESETS,
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
  const { cpu } = useContext(ViewPageContext);

  const name = useMemo(() => {
    return formatProductName(cpu, { company: false, brand: false });
  }, [cpu]);

  const performanceRankHref = useMemo(() => {
    if (hasProductRank(cpu, RankKey.PerformanceRating)) {
      return getListCpusPath(LIST_CPUS_PRESETS['best-performance']);
    }
    return undefined;
  }, [cpu]);

  const valueRankHref = useMemo(() => {
    if (hasProductRank(cpu, RankKey.PerformancePerMsrp)) {
      return getListCpusPath(LIST_CPUS_PRESETS['best-value']);
    }
    return undefined;
  }, [cpu]);

  return (
    <div className={classNames('flex flex-row md:flex-col gap-4', className)}>
      <ViewProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.PerformanceRating}
        name={name}
        maxRating={100}
        ratingField={cpu.fields?.performanceRating}
        rank={productRankValue(cpu, RankKey.PerformanceRating)}
        rankHref={performanceRankHref}
        className="flex-1"
      />

      <ViewProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.ValueRating}
        name={name}
        maxRating={100}
        ratingField={cpu.fields?.performancePerMsrp}
        rank={productRankValue(cpu, RankKey.PerformancePerMsrp)}
        rankHref={valueRankHref}
        className="flex-1"
      />
    </div>
  );
};
