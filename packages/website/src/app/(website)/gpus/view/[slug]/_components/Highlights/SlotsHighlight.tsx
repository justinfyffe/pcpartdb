import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { GpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React from 'react';

interface SlotsHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function SlotsHighlight(props: SlotsHighlightProps) {
  const { gpu, className } = props;

  const highlightSlot =
    productFieldFormattedValue(gpu.fields?.slotWidth) ?? '--';

  return (
    <ProductHighlight
      icon={<CubeTransparentIcon />}
      label="Slots"
      value={highlightSlot}
      className={className}
    />
  );
}
