import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuField } from '../../../..';
import { ViewPageContext } from '../../context';
import {
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
} from './HighlightList';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const specs = gpu.specs;
  const ranks = gpu.ranks;

  const highlightMemory = useMemo(() => {
    const memorySize = formatGpuField(specs.memorySize);
    const memoryType = formatGpuField(specs.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [specs]);

  const highlightSlots = useMemo(() => {
    const slotWidth = formatGpuField(specs.slotWidth);
    let height = formatGpuField(specs.height);
    height = height != null ? `${height} (H)` : null;
    return (
      [slotWidth, height].filter((value) => value != null).join(', ') || '--'
    );
  }, [specs]);

  const highlightTdp = useMemo(() => {
    return formatGpuField(specs.thermalDesignPower) || '--';
  }, [specs.thermalDesignPower]);

  const highlightReleaseDate = useMemo(() => {
    return formatGpuField(gpu.releaseDate) || '--';
  }, [gpu.releaseDate]);

  return (
    <HighlightList className={className}>
      {/* <HighlightListItem>
        <HighlightLabel icon={<ShoppingCartIcon />}>Shop</HighlightLabel>

        <HighlightValue>
          {shoppingUrl != null ? (
            <HighlightButton
              href={shoppingUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-green-500 text-white"
            >
              Check Price
            </HighlightButton>
          ) : (
            <>--</>
          )}
        </HighlightValue>
      </HighlightListItem> */}

      <HighlightListItem>
        <HighlightLabel icon={<StarIcon />}>Performance Rank</HighlightLabel>

        <HighlightValue>{ranks?.performanceRank || '--'}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CurrencyDollarIcon />}>
          Value Rank
        </HighlightLabel>

        <HighlightValue>{ranks?.valueRank || '--'}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CircleStackIcon />}>Memory</HighlightLabel>

        <HighlightValue>{highlightMemory}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CubeTransparentIcon />}>Slots</HighlightLabel>

        <HighlightValue>{highlightSlots}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<BoltIcon />}>TDP</HighlightLabel>

        <HighlightValue>{highlightTdp}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CalendarDaysIcon />}>
          Release Date
        </HighlightLabel>

        <HighlightValue>{highlightReleaseDate}</HighlightValue>
      </HighlightListItem>
    </HighlightList>
  );
};
