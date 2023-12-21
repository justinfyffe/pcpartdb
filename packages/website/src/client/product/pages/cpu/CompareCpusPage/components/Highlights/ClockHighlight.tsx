import { ClockIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface ClockHighlightProps {
  className?: string;
}

export const ClockHighlight: FunctionComponent<ClockHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [cpu1, cpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatProductName(cpu1, { company: false, brand: true });
    const name2 = formatProductName(cpu2, { company: false, brand: true });

    const clock1 = productFieldFormattedValue(cpu1.fields?.clock) ?? '--';
    const turboClock1 =
      productFieldFormattedValue(cpu1.fields?.turboClock) ?? '--';
    const value1 = `${clock1} / ${turboClock1}`;
    const rawClock1 = productFieldRawValue(cpu1.fields?.clock) ?? 0;
    const rawTurbo1 =
      productFieldRawValue(cpu1.fields?.turboClock) ?? rawClock1;

    const clock2 = productFieldFormattedValue(cpu2.fields?.clock) ?? '--';
    const turboClock2 =
      productFieldFormattedValue(cpu2.fields?.turboClock) ?? '--';
    const value2 = `${clock2} / ${turboClock2}`;
    const rawClock2 = productFieldRawValue(cpu2.fields?.clock) ?? 0;
    const rawTurbo2 =
      productFieldRawValue(cpu2.fields?.turboClock) ?? rawClock2;

    const bold1 = rawClock1 > rawClock2 && rawTurbo1 > rawTurbo2;
    const bold2 = rawClock2 > rawClock1 && rawTurbo2 > rawTurbo1;

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [cpu1, cpu2]);

  return (
    <ProductHighlightComparison
      icon={<ClockIcon />}
      label="Clock"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
