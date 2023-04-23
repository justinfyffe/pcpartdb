import { StarIcon } from '@heroicons/react/24/outline';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
} from './HighlightList';

interface PerformanceHighlightListItemProps {
  className?: string;
}

export const PerformanceHighlightListItem: FunctionComponent<
  PerformanceHighlightListItemProps
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
    return [
      formatGpuField(gpu1.performanceScore) || '--',
      formatGpuField(gpu2.performanceScore) || '--',
    ];
  }, [gpu1, gpu2]);

  const [bold1, bold2] = useMemo(() => {
    return [
      gpu1.performanceScore?.value > gpu2.performanceScore?.value,
      gpu1.performanceScore?.value < gpu2.performanceScore?.value,
    ];
  }, [gpu1.performanceScore?.value, gpu2.performanceScore?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<StarIcon className="md:hidden" />}>
        Performance Rating
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
