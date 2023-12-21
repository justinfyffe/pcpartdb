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
  const gpu = context.gpu;

  const highlightMemory = useMemo(() => {
    const memorySet = new Set([
      productFieldFormattedValue(gpu.fields?.memorySize),
      productFieldFormattedValue(gpu.fields?.memoryType),
    ]);
    return [...memorySet.values()].filter((value) => value != null).join(' ');
  }, [gpu]);

  return (
    <ProductHighlight
      icon={<CircleStackIcon />}
      label="Memory"
      value={highlightMemory}
      className={className}
    />
  );
};
