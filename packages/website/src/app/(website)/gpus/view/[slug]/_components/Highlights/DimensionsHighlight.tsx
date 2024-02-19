import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { formatGpuDimensions, GpuProduct } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React from 'react';

interface DimensionsHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function DimensionsHighlight(props: DimensionsHighlightProps) {
  const { gpu, className } = props;

  const highlightDimensions =
    formatGpuDimensions(gpu, { allowMissingDimensions: true }) ?? '--';

  return (
    <ProductHighlight
      icon={<CubeTransparentIcon />}
      label="Dimensions"
      value={highlightDimensions}
      className={className}
    />
  );
}
