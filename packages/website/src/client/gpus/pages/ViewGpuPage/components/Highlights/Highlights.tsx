import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { formatGpuDimensions, formatGpuField } from '../../../..';
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
  const benchmarks = gpu.benchmarks;
  const specs = gpu.specs;

  const highlightPerformance = useMemo(() => {
    return formatGpuField(benchmarks.performanceScore) || '--';
  }, [benchmarks]);

  const highlightValue = useMemo(() => {
    return formatGpuField(benchmarks.valueScore) || '--';
  }, [benchmarks]);

  const highlightMemory = useMemo(() => {
    const memorySize = formatGpuField(specs.memorySize);
    const memoryType = formatGpuField(specs.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [specs]);

  const highlightDimensions = useMemo(() => {
    return formatGpuDimensions(gpu, { allowMissingDimensions: true });
  }, [gpu]);

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
        <HighlightLabel icon={<StarIcon />}>Performance Rating</HighlightLabel>

        <HighlightValue>{highlightPerformance}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CurrencyDollarIcon />}>
          Performance Per Dollar
        </HighlightLabel>

        <HighlightValue>{highlightValue}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CircleStackIcon />}>Memory</HighlightLabel>

        <HighlightValue>{highlightMemory}</HighlightValue>
      </HighlightListItem>

      <HighlightListItem>
        <HighlightLabel icon={<CubeTransparentIcon />}>
          Dimensions
        </HighlightLabel>

        <HighlightValue>{highlightDimensions}</HighlightValue>
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
