import { StarIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getGpuChipset,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface PerformanceHighlightListItemProps {
  className?: string;
}

export const PerformanceHighlightListItem: FunctionComponent<
  PerformanceHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

  const values = useMemo(() => {
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const perf1 =
      productFieldFormattedValue(chipset1.fields?.performanceRating) ?? '--';
    const perf2 =
      productFieldFormattedValue(chipset2.fields?.performanceRating) ?? '--';

    const bold1 =
      productFieldRawValue(chipset1.fields?.performanceRating) >
      productFieldRawValue(chipset2.fields?.performanceRating);
    const bold2 =
      productFieldRawValue(chipset1.fields?.performanceRating) <
      productFieldRawValue(chipset2.fields?.performanceRating);

    return [
      { name: name1, value: perf1, bold: bold1 },
      { name: name2, value: perf2, bold: bold2 },
    ];
  }, [
    chipset1.fields?.performanceRating,
    chipset2.fields?.performanceRating,
    gpu1,
    gpu2,
  ]);

  return (
    <ProductHighlightComparison
      icon={<StarIcon />}
      label="Performance"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
