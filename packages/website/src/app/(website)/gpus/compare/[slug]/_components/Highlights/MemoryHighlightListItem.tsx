import { CircleStackIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  GpuProductComparison,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface MemoryHighlightListItemProps {
  comparison: GpuProductComparison;
  className?: string;
}

export const MemoryHighlightListItem: FunctionComponent<
  MemoryHighlightListItemProps
> = (props) => {
  const { comparison, className } = props;
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false, brand: true });
  const name2 = formatProductName(gpu2, { company: false, brand: true });

  const memorySize1 = productFieldFormattedValue(gpu1.fields?.memorySize);
  const memoryType1 = productFieldFormattedValue(gpu1.fields?.memoryType);
  const memory1 =
    [memorySize1, memoryType1].filter((value) => value != null).join(' ') ||
    '--';

  const memorySize2 = productFieldFormattedValue(gpu2.fields?.memorySize);
  const memoryType2 = productFieldFormattedValue(gpu2.fields?.memoryType);
  const memory2 =
    [memorySize2, memoryType2].filter((value) => value != null).join(' ') ||
    '--';

  const bold1 =
    productFieldRawValue(gpu1.fields?.memorySize) >
    productFieldRawValue(gpu2.fields?.memorySize);
  const bold2 =
    productFieldRawValue(gpu1.fields?.memorySize) <
    productFieldRawValue(gpu2.fields?.memorySize);

  const values = [
    { name: name1, value: memory1, bold: bold1 },
    { name: name2, value: memory2, bold: bold2 },
  ];

  return (
    <ProductHighlightComparison
      icon={<CircleStackIcon />}
      label="Memory"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
