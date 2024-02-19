import { ClockIcon } from '@heroicons/react/24/outline';
import { CpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent } from 'react';

interface ClockHighlightProps {
  cpu: CpuProduct;
  className?: string;
}

export const ClockHighlight: FunctionComponent<ClockHighlightProps> = (
  props,
) => {
  const { cpu, className } = props;

  const clock = productFieldFormattedValue(cpu.fields?.clock) ?? '--';
  const turboClock = productFieldFormattedValue(cpu.fields?.turboClock) ?? '--';

  const highlightClock = `${clock} / ${turboClock}`;

  return (
    <ProductHighlight
      icon={<ClockIcon />}
      label="Clock"
      value={highlightClock}
      className={className}
    />
  );
};
