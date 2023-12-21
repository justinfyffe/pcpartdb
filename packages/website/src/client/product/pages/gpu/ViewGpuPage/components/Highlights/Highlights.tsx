import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent } from 'react';
import { AffiliateHighlight } from './AffiliateHighlight';
import { DimensionsHighlight } from './DimensionsHighlight';
import { MemoryHighlight } from './MemoryHighlight';
import { PerformanceHighlight } from './PerformanceHighlight';
import { ReleaseDateHighlight } from './ReleaseDateHighlight';
import { TdpHighlight } from './TdpHighlight';
import { ValueHighlight } from './ValueHighlight';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        'grid grid-cols-2 sm:flex flex-col md:gap-2 gap-4',
        className,
      )}
    >
      <PerformanceHighlight />
      <ValueHighlight />
      <MemoryHighlight />
      <DimensionsHighlight />
      <TdpHighlight />
      <ReleaseDateHighlight />
      <AffiliateHighlight />
    </div>
  );
};
