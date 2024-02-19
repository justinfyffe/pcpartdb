import { GpuProductComparison } from '@pcpartdb/shared';
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
  comparison: GpuProductComparison;
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { comparison, className } = props;

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
        <MemoryHighlightListItem comparison={comparison} />
        <ClockHighlightListItem comparison={comparison} />
        <TdpHighlightListItem comparison={comparison} />
        <ReleaseDateHighlightListItem comparison={comparison} />
        <ShopHighlightListItem comparison={comparison} />
      </div>
    </div>
  );
};
