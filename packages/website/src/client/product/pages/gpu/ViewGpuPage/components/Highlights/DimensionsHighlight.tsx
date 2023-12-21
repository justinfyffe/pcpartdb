import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { formatGpuDimensions } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContextProvider';

interface DimensionsHighlightProps {
  className?: string;
}

export const DimensionsHighlight: FunctionComponent<
  DimensionsHighlightProps
> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;

  const highlightDimensions = useMemo(() => {
    return formatGpuDimensions(gpu, { allowMissingDimensions: true }) ?? '--';
  }, [gpu]);

  return (
    <ProductHighlight
      icon={<CubeTransparentIcon />}
      label="Dimensions"
      value={highlightDimensions}
      className={className}
    />
  );
};
