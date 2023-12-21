import { CircleStackIcon } from '@heroicons/react/24/outline';
import { productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface MemoryHighlightProps {
  className?: string;
}

export const MemoryHighlight: FunctionComponent<MemoryHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightMemory = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.memorySupport) ?? '--';
  }, [cpu]);

  return (
    <ProductHighlight
      icon={<CircleStackIcon />}
      label="Memory"
      value={highlightMemory}
      className={className}
    />
  );
};
