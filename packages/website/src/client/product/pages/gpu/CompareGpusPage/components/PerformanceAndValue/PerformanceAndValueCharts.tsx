import {
  formatProductName,
  getGpuChipset,
  getListGpusPath,
  LIST_GPUS_PRESETS,
  productRankValue,
  ProductType,
  RankKey,
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
  const chipset1 = getGpuChipset(comparison[0]);
  const chipset2 = getGpuChipset(comparison[1]);

  const performanceRankHref = useMemo(
    () => getListGpusPath(LIST_GPUS_PRESETS['best-performance']),
    [],
  );
  const valueRankHref = useMemo(
    () => getListGpusPath(LIST_GPUS_PRESETS['best-value']),
    [],
  );

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(chipset1, { company: false, brand: false }),
      formatProductName(chipset2, { company: false, brand: false }),
    ];
  }, [chipset1, chipset2]);

  return (
    <div className={classNames('flex flex-col gap-8', className)}>
      <CompareProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.PerformanceRating}
        names={[name1, name2]}
        maxRating={100}
        ratingFields={[
          chipset1.fields?.performanceRating,
          chipset2.fields?.performanceRating,
        ]}
        ranks={[
          productRankValue(chipset1, RankKey.PerformanceRating),
          productRankValue(chipset2, RankKey.PerformanceRating),
        ]}
        rankHrefs={[performanceRankHref, performanceRankHref]}
      />

      <CompareProductRatingCard
        productType={ProductType.Gpu}
        ratingType={ProductRatingType.ValueRating}
        names={[name1, name2]}
        maxRating={100}
        ratingFields={[
          chipset1.fields?.performancePerMsrp,
          chipset2.fields?.performancePerMsrp,
        ]}
        ranks={[
          productRankValue(chipset1, RankKey.PerformancePerMsrp),
          productRankValue(chipset2, RankKey.PerformancePerMsrp),
        ]}
        rankHrefs={[valueRankHref, valueRankHref]}
      />
    </div>
  );
};
