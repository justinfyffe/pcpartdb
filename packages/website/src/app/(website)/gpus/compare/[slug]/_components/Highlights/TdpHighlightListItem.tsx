import { BoltIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  GpuProductComparison,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface TdpHighlightListItemProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const TdpHighlightListItem: FunctionComponent<
  TdpHighlightListItemProps
> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false, brand: true });
  const name2 = formatProductName(gpu2, { company: false, brand: true });

  const value1 = productFieldFormattedValue(gpu1.fields?.tdp) ?? '--';
  const value2 = productFieldFormattedValue(gpu2.fields?.tdp) ?? '--';

  const bold1 =
    productFieldRawValue(gpu1.fields?.tdp) >
    productFieldRawValue(gpu2.fields?.tdp);
  const bold2 =
    productFieldRawValue(gpu1.fields?.tdp) <
    productFieldRawValue(gpu2.fields?.tdp);

  const values = [
    { name: name1, value: value1, bold: bold1 },
    { name: name2, value: value2, bold: bold2 },
  ];

  return (
    <ProductHighlightComparison
      icon={<BoltIcon />}
      label="TDP"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
