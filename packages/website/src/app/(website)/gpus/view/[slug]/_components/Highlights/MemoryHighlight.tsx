import { CircleStackIcon } from '@heroicons/react/24/outline';
import { GpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React from 'react';

interface MemoryHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function MemoryHighlight(props: MemoryHighlightProps) {
  const { gpu, className } = props;

  const memorySet = new Set([
    productFieldFormattedValue(gpu.fields?.memorySize),
    productFieldFormattedValue(gpu.fields?.memoryType),
  ]);
  const highlightMemory = [...memorySet.values()]
    .filter((value) => value != null)
    .join(' ');

  return (
    <ProductHighlight
      icon={<CircleStackIcon />}
      label="Memory"
      value={highlightMemory}
      className={className}
    />
  );
}
