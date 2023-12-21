import { BoltIcon } from '@heroicons/react/24/outline';
import { productFieldFormattedValue } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface TdpHighlightProps {
  className?: string;
}

export const TdpHighlight: FunctionComponent<TdpHighlightProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;

  const highlightTdp = useMemo(() => {
    return productFieldFormattedValue(gpu.fields?.tdp) ?? '--';
  }, [gpu.fields?.tdp]);

  return (
    <ProductHighlight
      icon={<BoltIcon />}
      label="TDP"
      value={highlightTdp}
      className={className}
    />
  );
};
