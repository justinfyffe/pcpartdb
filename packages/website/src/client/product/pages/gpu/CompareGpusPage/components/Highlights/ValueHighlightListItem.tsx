import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getGpuChipset,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
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
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const value1 =
      productFieldFormattedValue(chipset1.fields?.performancePerMsrp) ?? '--';
    const value2 =
      productFieldFormattedValue(chipset2.fields?.performancePerMsrp) ?? '--';

    const bold1 =
      productFieldRawValue(chipset1.fields?.performancePerMsrp) >
      productFieldRawValue(chipset2.fields?.performancePerMsrp);
    const bold2 =
      productFieldRawValue(chipset1.fields?.performancePerMsrp) <
      productFieldRawValue(chipset2.fields?.performancePerMsrp);

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [
    chipset1.fields?.performancePerMsrp,
    chipset2.fields?.performancePerMsrp,
    gpu1,
    gpu2,
  ]);

  return (
    <ProductHighlightComparison
      icon={<CurrencyDollarIcon />}
      label="Value Rating"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
