import { ClockIcon } from '@heroicons/react/24/outline';
import { formatGpuField, formatGpuName } from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface ClockHighlightListItemProps {
  className?: string;
}

export const ClockHighlightListItem: FunctionComponent<
  ClockHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatGpuName(gpu1, { company: false, brand: true });
    const name2 = formatGpuName(gpu2, { company: false, brand: true });

    const clockBase1 = formatGpuField(gpu1.coreClockSpeedBase);
    const clockBoost1 = formatGpuField(gpu1.coreClockSpeedBoost);
    const clock1 =
      [clockBase1, clockBoost1].filter((value) => value != null).join(' / ') ||
      '--';

    const clockBase2 = formatGpuField(gpu2.coreClockSpeedBase);
    const clockBoost2 = formatGpuField(gpu2.coreClockSpeedBoost);
    const clock2 =
      [clockBase2, clockBoost2].filter((value) => value != null).join(' / ') ||
      '--';

    let bold1 = false;
    let bold2 = false;
    if (gpu1.coreClockSpeedBase?.value === gpu2.coreClockSpeedBase?.value) {
      bold1 = gpu1.coreClockSpeedBoost?.value > gpu2.coreClockSpeedBoost?.value;
      bold2 = gpu1.coreClockSpeedBoost?.value < gpu2.coreClockSpeedBoost?.value;
    } else {
      bold1 = gpu1.coreClockSpeedBase?.value > gpu2.coreClockSpeedBase?.value;
      bold2 = gpu1.coreClockSpeedBase?.value < gpu2.coreClockSpeedBase?.value;
    }

    return [
      { name: name1, value: clock1, bold: bold1 },
      { name: name2, value: clock2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<ClockIcon />}
      label="Clock"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
