import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField, getGpuName } from '../../../..';
import { ComparePageContext } from '../../context';
import { ClockHighlightListItem } from './ClockHighlightListItem';
import {
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
  HighlightValues,
} from './HighlightList';
import { MemoryHighlightListItem } from './MemoryHighlightListItem';
import { PerformanceHighlightListItem } from './PerformanceHighlightListItem';
import { ReleaseDateHighlightListItem } from './ReleaseDateHighlightListItem';
import { TdpHighlightListItem } from './TdpHighlightListItem';
import { ValueHighlightListItem } from './ValueHighlightListItem';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  return (
    <HighlightList className={className}>
      <PerformanceHighlightListItem />
      <ValueHighlightListItem />
      <MemoryHighlightListItem />
      <ClockHighlightListItem />
      <TdpHighlightListItem />
      <ReleaseDateHighlightListItem />
    </HighlightList>
  );
};
