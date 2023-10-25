import {
  formatProductName,
  getListCpusPath,
  LIST_CPUS_PRESETS,
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
  const { cpu } = useContext(ViewPageContext);

  const name = useMemo(() => {
    return formatProductName(cpu, { company: false, brand: false });
  }, [cpu]);

  const performanceRankHref = useMemo(() => {
    if (cpu.ranks?.performanceRating) {
      return getListCpusPath(LIST_CPUS_PRESETS['best-performance']);
    }
    return undefined;
  }, [cpu.ranks?.performanceRating]);

  const valueRankHref = useMemo(() => {
    if (cpu.ranks?.performancePerMsrp) {
      return getListCpusPath(LIST_CPUS_PRESETS['best-value']);
    }
    return undefined;
  }, [cpu.ranks?.performancePerMsrp]);

  return (
    <div className={classNames('flex flex-wrap gap-8', className)}>
      <ViewProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.PerformanceRating}
        name={name}
        maxRating={100}
        ratingField={cpu.fields?.performanceRating}
        rank={cpu.ranks?.performanceRating}
        rankHref={performanceRankHref}
      />

      <ViewProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.ValueRating}
        name={name}
        maxRating={100}
        ratingField={cpu.fields?.performancePerMsrp}
        rank={cpu.ranks?.performancePerMsrp}
        rankHref={valueRankHref}
      />
    </div>
  );
};
