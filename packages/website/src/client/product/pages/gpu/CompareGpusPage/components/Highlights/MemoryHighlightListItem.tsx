import { CircleStackIcon } from '@heroicons/react/24/outline';
import { formatGpuField, formatGpuName } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface MemoryHighlightListItemProps {
  className?: string;
}

export const MemoryHighlightListItem: FunctionComponent<
  MemoryHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatGpuName(gpu1, { company: false, brand: true });
    const name2 = formatGpuName(gpu2, { company: false, brand: true });

    const memorySize1 = formatGpuField(gpu1.memorySize);
    const memoryType1 = formatGpuField(gpu1.memoryType);
    const memory1 =
      [memorySize1, memoryType1].filter((value) => value != null).join(' ') ||
      '--';

    const memorySize2 = formatGpuField(gpu2.memorySize);
    const memoryType2 = formatGpuField(gpu2.memoryType);
    const memory2 =
      [memorySize2, memoryType2].filter((value) => value != null).join(' ') ||
      '--';

    const bold1 = gpu1.memorySize?.value > gpu2.memorySize?.value;
    const bold2 = gpu1.memorySize?.value < gpu2.memorySize?.value;

    return [
      { name: name1, value: memory1, bold: bold1 },
      { name: name2, value: memory2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<CircleStackIcon />}
      label="Memory"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
