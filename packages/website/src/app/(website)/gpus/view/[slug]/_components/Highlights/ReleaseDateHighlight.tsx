import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { GpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React from 'react';

interface ReleaseDateHighlightProps {
  gpu: GpuProduct;
  className?: string;
}

export function ReleaseDateHighlight(props: ReleaseDateHighlightProps) {
  const { gpu, className } = props;
  const highlightReleaseDate =
    productFieldFormattedValue(gpu.fields?.releaseDate) ?? '--';

  return (
    <ProductHighlight
      icon={<CalendarDaysIcon />}
      label="Release Date"
      value={highlightReleaseDate}
      className={className}
    />
  );
}
