import { GpuProduct } from '@pcpartdb/shared';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';
import { AffiliateHighlight } from './AffiliateHighlight';
import { MemoryHighlight } from './MemoryHighlight';
import { PerformanceHighlight } from './PerformanceHighlight';
import { ReleaseDateHighlight } from './ReleaseDateHighlight';
import { SlotsHighlight } from './SlotsHighlight';
import { TdpHighlight } from './TdpHighlight';
import { ValueHighlight } from './ValueHighlight';

interface HighlightsProps {
  gpu: GpuProduct;
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { gpu, className } = props;

  return (
    <div
      className={classNames(
        'grid grid-cols-2 sm:flex flex-col gap-y-4 gap-x-6',
        className,
      )}
    >
      <PerformanceHighlight />
      <ValueHighlight />
      <MemoryHighlight gpu={gpu} />
      <SlotsHighlight gpu={gpu} />
      <TdpHighlight gpu={gpu} />
      <ReleaseDateHighlight gpu={gpu} />
      <AffiliateHighlight gpu={gpu} />
    </div>
  );
};
