import { StarIcon } from '@heroicons/react/24/outline';
import { getGpuChipset } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components';
import {
  formatGpuField,
  formatGpuName,
} from 'packages/website/src/client/product/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

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
    const name1 = formatGpuName(gpu1, { company: false, brand: false });
    const name2 = formatGpuName(gpu2, { company: false, brand: false });

    const perf1 = formatGpuField(chipset1.performanceScore) || '--';
    const perf2 = formatGpuField(chipset2.performanceScore) || '--';

    const bold1 =
      chipset1.performanceScore?.value > chipset2.performanceScore?.value;
    const bold2 =
      chipset1.performanceScore?.value < chipset2.performanceScore?.value;

    return [
      { name: name1, value: perf1, bold: bold1 },
      { name: name2, value: perf2, bold: bold2 },
    ];
  }, [chipset1.performanceScore, chipset2.performanceScore, gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<StarIcon />}
      label="Performance"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
