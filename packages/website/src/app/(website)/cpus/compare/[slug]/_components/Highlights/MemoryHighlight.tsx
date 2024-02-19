import { CircleStackIcon } from '@heroicons/react/24/outline';
import {
  CpuProductComparison,
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface MemoryHighlightProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const MemoryHighlight: FunctionComponent<MemoryHighlightProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false, brand: true });
  const name2 = formatProductName(cpu2, { company: false, brand: true });

  let value1 = productFieldFormattedValue(cpu1.fields?.memorySupport) ?? '--';
  if (value1.indexOf(',') >= 0) {
    value1 = value1.substring(0, value1.indexOf(','));
  }

  let value2 = productFieldFormattedValue(cpu2.fields?.memorySupport) ?? '--';
  if (value2.indexOf(',') >= 0) {
    value2 = value2.substring(0, value2.indexOf(','));
  }

  const values = [
    { name: name1, value: value1, bold: false },
    { name: name2, value: value2, bold: false },
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
