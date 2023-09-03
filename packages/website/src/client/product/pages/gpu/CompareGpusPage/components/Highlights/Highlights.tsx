import { classNames } from 'packages/website/src/client/shared/ui';
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
          'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4',
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
