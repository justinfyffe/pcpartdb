import { formatGpuSpec, getShoppingUrl } from '@client/gpus';
import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context';
import {
  HighlightButton,
  HighlightLabel,
  HighlightList,
  HighlightListItem,
  HighlightValue,
} from './highlight-list';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const specs = gpu.specs;
  const ranks = gpu.ranks;

  const shoppingUrl = getShoppingUrl(gpu);

  const highlightMemory = useMemo(() => {
    const memorySize = formatGpuSpec(specs.memorySize);
    const memoryType = formatGpuSpec(specs.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [specs]);

  const highlightSlots = useMemo(() => {
    const slotWidth = formatGpuSpec(specs.slotWidth);
    const height = formatGpuSpec(specs.height);
    return [slotWidth, height].filter((value) => value != null).join(', ');
  }, [specs]);

  return (
    <HighlightList className={className}>
      <HighlightListItem>
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
      </HighlightListItem>

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

        <HighlightValue>
          {formatGpuSpec(specs.thermalDesignPower) || '--'}
        </HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CalendarDaysIcon />}>
          Release Date
        </HighlightLabel>

        <HighlightValue>
          {formatGpuSpec(specs.releaseDate) || '--'}
        </HighlightValue>
      </HighlightListItem>
    </HighlightList>
  );
};
