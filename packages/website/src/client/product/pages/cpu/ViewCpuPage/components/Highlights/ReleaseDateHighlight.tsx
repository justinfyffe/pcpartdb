import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface ReleaseDateHighlightProps {
  className?: string;
}

export const ReleaseDateHighlight: FunctionComponent<
  ReleaseDateHighlightProps
> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightReleaseDate = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--';
  }, [cpu.fields?.releaseDate]);

  return (
    <ProductHighlight
      icon={<CalendarDaysIcon />}
      label="Release Date"
      value={highlightReleaseDate}
      className={className}
    />
  );
};
