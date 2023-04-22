import { CircleStackIcon } from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import {
  HighlightLabel,
  HighlightListItem,
  HighlightValue,
  HighlightValues,
} from './HighlightList';

interface MemoryHighlightListItemProps {
  className?: string;
}

export const MemoryHighlightListItem: FunctionComponent<
  MemoryHighlightListItemProps
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
    const memorySize1 = formatGpuField(gpu1.memorySize);
    const memoryType1 = formatGpuField(gpu1.memoryType);
    const memory1 = [memorySize1, memoryType1]
      .filter((value) => value != null)
      .join(' ');

    const memorySize2 = formatGpuField(gpu2.memorySize);
    const memoryType2 = formatGpuField(gpu2.memoryType);
    const memory2 = [memorySize2, memoryType2]
      .filter((value) => value != null)
      .join(' ');

    return [memory1, memory2];
  }, [gpu1, gpu2]);

  const [bold1, bold2] = useMemo(() => {
    return [
      gpu1.memorySize?.value > gpu2.memorySize?.value,
      gpu1.memorySize?.value < gpu2.memorySize?.value,
    ];
  }, [gpu1.memorySize?.value, gpu2.memorySize?.value]);

  return (
    <HighlightListItem className={className}>
      <HighlightLabel icon={<CircleStackIcon className="md:hidden" />}>
        Memory
      </HighlightLabel>

      <HighlightValues>
        <HighlightValue className={bold1 ? 'font-bold' : ''}>
          {names[0]}: {values[0]}
        </HighlightValue>
        <HighlightValue className={bold2 ? 'font-bold' : ''}>
          {names[1]}: {values[1]}
        </HighlightValue>
      </HighlightValues>
    </HighlightListItem>
  );
};
