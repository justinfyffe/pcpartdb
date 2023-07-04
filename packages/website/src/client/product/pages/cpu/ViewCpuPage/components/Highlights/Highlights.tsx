import {
  CalendarDaysIcon,
  CircleStackIcon,
  ClockIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  formatCpuField,
  ProductHighlight,
} from 'packages/website/src/client/product';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightPerformance = useMemo(() => {
    const performanceScore = formatCpuField(cpu.performanceScore);

    if (performanceScore != null) {
      return `${performanceScore}`;
    } else {
      return '--';
    }
  }, [cpu.performanceScore]);

  const highlightValue = useMemo(() => {
    const valueScore = formatCpuField(cpu.valueScore);

    if (valueScore != null) {
      return `${valueScore}`;
    } else {
      return '--';
    }
  }, [cpu.valueScore]);

  const highlightCoresThreads = useMemo(() => {
    const cores = formatCpuField(cpu.coresCount) || '--';
    const threads = formatCpuField(cpu.threadsCount) || '--';
    return `${cores} / ${threads}`;
  }, [cpu]);

  const highlightClock = useMemo(() => {
    const clock = formatCpuField(cpu.clock) || '--';
    const turboClock = formatCpuField(cpu.turboClock) || '--';
    return `${clock} / ${turboClock}`;
  }, [cpu]);

  const highlightMemory = useMemo(() => {
    return formatCpuField(cpu.memorySupport) || '--';
  }, [cpu]);

  const highlightReleaseDate = useMemo(() => {
    return formatCpuField(cpu.releaseDate) || '--';
  }, [cpu.releaseDate]);

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
        icon={<CpuChipIcon />}
        label="Cores / Threads"
        value={highlightCoresThreads}
      />

      <ProductHighlight
        icon={<CircleStackIcon />}
        label="Memory"
        value={highlightMemory}
      />

      <ProductHighlight
        icon={<ClockIcon />}
        label="Clock"
        value={highlightClock}
      />

      <ProductHighlight
        icon={<CalendarDaysIcon />}
        label="Release Date"
        value={highlightReleaseDate}
      />
    </div>
  );
};
