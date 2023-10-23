import {
  formatProductName,
  getListCpusPath,
  LIST_CPUS_PRESETS,
  ProductType,
} from '@pcpartdb/shared';
import { CompareProductRatingCard } from 'packages/website/src/client/product/components/ProductRatingCard/CompareProductRatingCard';
import { ProductRatingType } from 'packages/website/src/client/product/components/ProductRatingCard/types';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const { comparison } = useContext(ComparePageContext);
  const cpu1 = comparison[0];
  const cpu2 = comparison[1];

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
    <div className={classNames('flex flex-col gap-4', className)}>
      <CompareProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.PerformanceRating}
        names={[name1, name2]}
        maxRating={100}
        ratingFields={[
          cpu1.fields?.performanceRating,
          cpu2.fields?.performanceRating,
        ]}
        ranks={[cpu1?.ranks?.performanceRating, cpu2?.ranks?.performanceRating]}
        rankHrefs={[performanceRankHref, performanceRankHref]}
      />

      <CompareProductRatingCard
        productType={ProductType.Cpu}
        ratingType={ProductRatingType.ValueRating}
        names={[name1, name2]}
        maxRating={100}
        ratingFields={[
          cpu1.fields?.performancePerMsrp,
          cpu2.fields?.performancePerMsrp,
        ]}
        ranks={[
          cpu1?.ranks?.performancePerMsrp,
          cpu2?.ranks?.performancePerMsrp,
        ]}
        rankHrefs={[valueRankHref, valueRankHref]}
      />
    </div>
  );
};
