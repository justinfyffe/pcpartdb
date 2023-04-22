import React, { FunctionComponent } from 'react';
import { ClockHighlightListItem } from './ClockHighlightListItem';
import { HighlightList } from './HighlightList';
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
