import { CircleStackIcon } from '@heroicons/react/24/outline';
import { CpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent } from 'react';

interface MemoryHighlightProps {
  cpu: CpuProduct;
  className?: string;
}

export const MemoryHighlight: FunctionComponent<MemoryHighlightProps> = (
  props,
) => {
  const { cpu, className } = props;

  const highlightMemory =
    productFieldFormattedValue(cpu.fields?.memorySupport) ?? '--';

  return (
    <ProductHighlight
      icon={<CircleStackIcon />}
      label="Memory"
      value={highlightMemory}
      className={className}
    />
  );
};
