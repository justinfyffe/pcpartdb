import {
  BoltIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { ProductHighlight } from 'packages/website/src/client/product/components';
import {
  formatGpuDimensions,
  formatGpuField,
} from 'packages/website/src/client/product/utils';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const gpu = context.gpu;
  const parent = gpu.chipset;

  const highlightPerformance = useMemo(() => {
    const performanceScore =
      formatGpuField(gpu.performanceScore) ||
      formatGpuField(parent?.performanceScore);

    if (performanceScore != null) {
      return `${performanceScore}`;
    } else {
      return '--';
    }
  }, [gpu.performanceScore, parent?.performanceScore]);

  const highlightValue = useMemo(() => {
    const valueScore =
      formatGpuField(gpu.valueScore) || formatGpuField(parent?.valueScore);

    if (valueScore != null) {
      return `${valueScore}`;
    } else {
      return '--';
    }
  }, [gpu.valueScore, parent?.valueScore]);

  const highlightMemory = useMemo(() => {
    const memorySize = formatGpuField(gpu.memorySize);
    const memoryType = formatGpuField(gpu.memoryType);
    return [memorySize, memoryType].filter((value) => value != null).join(' ');
  }, [gpu]);

  const highlightDimensions = useMemo(() => {
    return formatGpuDimensions(gpu, { allowMissingDimensions: true }) || '--';
  }, [gpu]);

  const highlightTdp = useMemo(() => {
    return formatGpuField(gpu.thermalDesignPower) || '--';
  }, [gpu.thermalDesignPower]);

  const highlightReleaseDate = useMemo(() => {
    return formatGpuField(gpu.releaseDate) || '--';
  }, [gpu.releaseDate]);

  return (
    <div
      className={classNames(
        'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4',
        className,
      )}
    >
      <ProductHighlight
        icon={<StarIcon />}
        label="Performance"
        value={highlightPerformance}
      />

      <ProductHighlight
        icon={<CurrencyDollarIcon />}
        label="Performance / $"
        value={highlightValue}
      />

      <ProductHighlight
        icon={<CircleStackIcon />}
        label="Memory"
        value={highlightMemory}
      />

      <ProductHighlight
        icon={<CubeTransparentIcon />}
        label="Dimensions"
        value={highlightDimensions}
      />

      <ProductHighlight icon={<BoltIcon />} label="TDP" value={highlightTdp} />

      <ProductHighlight
        icon={<CalendarDaysIcon />}
        label="Release Date"
        value={highlightReleaseDate}
      />
    </div>
  );
};
