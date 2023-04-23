import { ClockIcon } from '@heroicons/react/24/outline';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
} from './HighlightList';

interface ClockHighlightListItemProps {
  className?: string;
}

export const ClockHighlightListItem: FunctionComponent<
  ClockHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const names = useMemo(
    () => [
      getGpuName(gpu1, { company: false, brand: false }),
      getGpuName(gpu2, { company: false, brand: false }),
    ],
    [gpu1, gpu2],
  );

  const values = useMemo(() => {
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

    return [clock1, clock2];
  }, [gpu1, gpu2]);

  const [bold1, bold2] = useMemo(() => {
    return [
      gpu1.coreClockSpeedBase?.value > gpu2.coreClockSpeedBase?.value,
      gpu1.coreClockSpeedBase?.value < gpu2.coreClockSpeedBase?.value,
    ];
  }, [gpu1.coreClockSpeedBase?.value, gpu2.coreClockSpeedBase?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<ClockIcon className="md:hidden" />}>
        Clock
      </HighlightLabel>

      <HighlightValue>
        <div className={classNames('text-right', bold1 ? 'font-bold' : '')}>
          {names[0]}:
        </div>
        <div className={classNames('text-right', bold1 ? 'font-bold' : '')}>
          {values[0]}
        </div>
        <div className={classNames('text-right', bold2 ? 'font-bold' : '')}>
          {names[1]}:
        </div>
        <div className={classNames('text-right', bold2 ? 'font-bold' : '')}>
          {values[1]}
        </div>
      </HighlightValue>
    </HighlightListItem>
  );
};
