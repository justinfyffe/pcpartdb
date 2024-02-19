import { CpuChipIcon } from '@heroicons/react/24/outline';
import { CpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent } from 'react';

interface CoresHighlightProps {
  cpu: CpuProduct;
  className?: string;
}

export const CoresHighlight: FunctionComponent<CoresHighlightProps> = (
  props,
) => {
  const { cpu, className } = props;

  const cores = productFieldFormattedValue(cpu.fields?.cores) ?? '--';
  const threads = productFieldFormattedValue(cpu.fields?.threads) ?? '--';
  const highlightCoresThreads = `${cores} / ${threads}`;

  return (
    <ProductHighlight
      icon={<CpuChipIcon />}
      label="Cores / Threads"
      value={highlightCoresThreads}
      className={className}
    />
  );
};
