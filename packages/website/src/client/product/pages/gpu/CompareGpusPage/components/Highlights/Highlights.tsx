import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';
import { ClockHighlightListItem } from './ClockHighlightListItem';
import { MemoryHighlightListItem } from './MemoryHighlightListItem';
import { PerformanceHighlightListItem } from './PerformanceHighlightListItem';
import { ReleaseDateHighlightListItem } from './ReleaseDateHighlightListItem';
import { ShopHighlightListItem } from './ShopHighlightListItem';
import { TdpHighlightListItem } from './TdpHighlightListItem';
import { ValueHighlightListItem } from './ValueHighlightListItem';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  return (
    <div>
      <div
        className={classNames(
          'grid grid-cols-2 sm:flex flex-col gap-y-4 gap-x-6',
          className,
        )}
      >
        <PerformanceHighlightListItem />
        <ValueHighlightListItem />
        <MemoryHighlightListItem />
        <ClockHighlightListItem />
        <TdpHighlightListItem />
        <ReleaseDateHighlightListItem />
        <ShopHighlightListItem />
      </div>
    </div>
  );
};
