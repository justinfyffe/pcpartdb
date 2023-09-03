import {
  CalendarDaysIcon,
  CircleStackIcon,
  ClockIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { formatCpuField, getCpuAffiliateUrl } from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
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

  const cpuAffiliateUrl = useMemo(() => getCpuAffiliateUrl(cpu), [cpu]);

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
        label="Performance / $ (MSRP)"
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

      {cpuAffiliateUrl && (
        <div className="flex flex-col">
          <ProductHighlight
            icon={<ShoppingCartIcon />}
            label="Shop"
            value={
              <WarningButton
                href={cpuAffiliateUrl}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </WarningButton>
            }
          />
          {cpuAffiliateUrl && <AffiliateDisclaimer />}
        </div>
      )}
    </div>
  );
};
