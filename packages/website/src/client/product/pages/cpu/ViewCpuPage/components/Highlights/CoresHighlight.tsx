import { CpuChipIcon } from '@heroicons/react/24/outline';
import { productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface CoresHighlightProps {
  className?: string;
}

export const CoresHighlight: FunctionComponent<CoresHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightCoresThreads = useMemo(() => {
    const cores = productFieldFormattedValue(cpu.fields?.cores) ?? '--';
    const threads = productFieldFormattedValue(cpu.fields?.threads) ?? '--';
    return `${cores} / ${threads}`;
  }, [cpu]);

  return (
    <ProductHighlight
      icon={<CpuChipIcon />}
      label="Cores / Threads"
      value={highlightCoresThreads}
      className={className}
    />
  );
};
