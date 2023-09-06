import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { formatGpuField, formatGpuName, getGpuChipset } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface ValueHighlightListItemProps {
  className?: string;
}

export const ValueHighlightListItem: FunctionComponent<
  ValueHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

  const values = useMemo(() => {
    const name1 = formatGpuName(gpu1, { company: false, brand: true });
    const name2 = formatGpuName(gpu2, { company: false, brand: true });

    const value1 = formatGpuField(chipset1.valueScore) || '--';
    const value2 = formatGpuField(chipset2.valueScore) || '--';

    const bold1 = chipset1.valueScore?.value > chipset2.valueScore?.value;
    const bold2 = chipset1.valueScore?.value < chipset2.valueScore?.value;

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [chipset1.valueScore, chipset2.valueScore, gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<CurrencyDollarIcon />}
      label="Performance / $ (MSRP)"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
