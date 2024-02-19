import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { CpuProduct, productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent } from 'react';

interface ReleaseDateHighlightProps {
  cpu: CpuProduct;
  className?: string;
}

export const ReleaseDateHighlight: FunctionComponent<
  ReleaseDateHighlightProps
> = (props) => {
  const { cpu, className } = props;

  const highlightReleaseDate =
    productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--';

  return (
    <ProductHighlight
      icon={<CalendarDaysIcon />}
      label="Release Date"
      value={highlightReleaseDate}
      className={className}
    />
  );
};
