import { BoltIcon } from '@heroicons/react/24/outline';
import { formatGpuField, formatGpuName } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface TdpHighlightListItemProps {
  className?: string;
}

export const TdpHighlightListItem: FunctionComponent<
  TdpHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatGpuName(gpu1, { company: false, brand: true });
    const name2 = formatGpuName(gpu2, { company: false, brand: true });

    const value1 = formatGpuField(gpu1.thermalDesignPower) || '--';
    const value2 = formatGpuField(gpu2.thermalDesignPower) || '--';

    const bold1 =
      gpu1.thermalDesignPower?.value > gpu2.thermalDesignPower?.value;
    const bold2 =
      gpu1.thermalDesignPower?.value < gpu2.thermalDesignPower?.value;

    return [
      { name: name1, value: value1, bold: bold1 },
      { name: name2, value: value2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<BoltIcon />}
      label="TDP"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
