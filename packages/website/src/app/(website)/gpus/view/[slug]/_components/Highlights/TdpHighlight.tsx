import { BoltIcon } from '@heroicons/react/24/outline';
import { GpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React from 'react';

interface TdpHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function TdpHighlight(props: TdpHighlightProps) {
  const { gpu, className } = props;

  const highlightTdp = productFieldFormattedValue(gpu.fields?.tdp) ?? '--';

  return (
    <ProductHighlight
      icon={<BoltIcon />}
      label="TDP"
      value={highlightTdp}
      className={className}
    />
  );
}
