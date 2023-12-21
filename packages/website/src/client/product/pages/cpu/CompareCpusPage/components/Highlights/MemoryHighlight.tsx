import { CircleStackIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface MemoryHighlightProps {
  className?: string;
}

export const MemoryHighlight: FunctionComponent<MemoryHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [cpu1, cpu2] = context.comparison;

  const values = useMemo(() => {
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

    return [
      { name: name1, value: value1, bold: false },
      { name: name2, value: value2, bold: false },
    ];
  }, [cpu1, cpu2]);

  return (
    <ProductHighlightComparison
      icon={<CircleStackIcon />}
      label="Memory"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
