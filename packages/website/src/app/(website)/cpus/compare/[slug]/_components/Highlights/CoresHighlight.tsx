import { CpuChipIcon } from '@heroicons/react/24/outline';
import {
  CpuProductComparison,
  formatProductName,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent } from 'react';

interface CoresHighlightProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const CoresHighlight: FunctionComponent<CoresHighlightProps> = (
  props,
) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false, brand: true });
  const name2 = formatProductName(cpu2, { company: false, brand: true });

  const cores1 = productFieldFormattedValue(cpu1.fields?.cores) ?? '--';
  const threads1 = productFieldFormattedValue(cpu1.fields?.threads) ?? '--';
  const value1 = `${cores1} / ${threads1}`;

  const cores2 = productFieldFormattedValue(cpu2.fields?.cores) ?? '--';
  const threads2 = productFieldFormattedValue(cpu2.fields?.threads) ?? '--';
  const value2 = `${cores2} / ${threads2}`;

  const bold1 =
    productFieldRawValue(cpu1.fields?.cores) >
    productFieldRawValue(cpu2.fields?.cores);
  const bold2 =
    productFieldRawValue(cpu1.fields?.cores) <
    productFieldRawValue(cpu2.fields?.cores);

  const values = [
    { name: name1, value: value1, bold: bold1 },
    { name: name2, value: value2, bold: bold2 },
  ];

  return (
    <ProductHighlightComparison
      icon={<CpuChipIcon />}
      label="Cores / Threads"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
