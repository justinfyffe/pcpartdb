import { CircleStackIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface MemoryHighlightListItemProps {
  className?: string;
}

export const MemoryHighlightListItem: FunctionComponent<
  MemoryHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
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

    return [
      { name: name1, value: memory1, bold: bold1 },
      { name: name2, value: memory2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<CircleStackIcon />}
      label="Memory"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
