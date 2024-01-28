import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';
import { AffiliateHighlight } from './AffiliateHighlight';
import { ClockHighlight } from './ClockHighlight';
import { CoresHighlight } from './CoresHighlight';
import { MemoryHighlight } from './MemoryHighlight';
import { PerformanceHighlight } from './PerformanceHighlight';
import { ReleaseDateHighlight } from './ReleaseDateHighlight';
import { ValueHighlight } from './ValueHighlight';

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
        <PerformanceHighlight />
        <ValueHighlight />
        <CoresHighlight />
        <MemoryHighlight />
        <ClockHighlight />
        <ReleaseDateHighlight />
        <AffiliateHighlight />
      </div>
    </div>
  );
};
