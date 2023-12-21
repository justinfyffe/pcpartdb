import { ClockIcon } from '@heroicons/react/24/outline';
import { productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface ClockHighlightProps {
  className?: string;
}

export const ClockHighlight: FunctionComponent<ClockHighlightProps> = (
  props,
) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightClock = useMemo(() => {
    const clock = productFieldFormattedValue(cpu.fields?.clock) ?? '--';
    const turboClock =
      productFieldFormattedValue(cpu.fields?.turboClock) ?? '--';
    return `${clock} / ${turboClock}`;
  }, [cpu]);

  return (
    <ProductHighlight
      icon={<ClockIcon />}
      label="ClockIcon"
      value={highlightClock}
      className={className}
    />
  );
};
