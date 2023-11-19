import {
  CalendarDaysIcon,
  CircleStackIcon,
  ClockIcon,
  CpuChipIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  getCpuAffiliateUrl,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductHighlight } from 'packages/website/src/client/product/components/ProductHighlight/ProductHighlight';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { AmazonButton } from 'packages/website/src/client/shared/components/Button/AmazonButton';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ViewPageContext);
  const cpu = context.cpu;

  const highlightPerformance = useMemo(() => {
    const performanceScore = productFieldFormattedValue(
      cpu.fields?.performanceRating,
    );

    if (performanceScore != null) {
      return `${performanceScore}`;
    } else {
      return '--';
    }
  }, [cpu.fields?.performanceRating]);

  const highlightValue = useMemo(() => {
    const valueScore = productFieldFormattedValue(
      cpu.fields?.performancePerMsrp,
    );

    if (valueScore != null) {
      return `${valueScore}`;
    } else {
      return '--';
    }
  }, [cpu.fields?.performancePerMsrp]);

  const highlightCoresThreads = useMemo(() => {
    const cores = productFieldFormattedValue(cpu.fields?.cores) ?? '--';
    const threads = productFieldFormattedValue(cpu.fields?.threads) ?? '--';
    return `${cores} / ${threads}`;
  }, [cpu]);

  const highlightClock = useMemo(() => {
    const clock = productFieldFormattedValue(cpu.fields?.clock) ?? '--';
    const turboClock =
      productFieldFormattedValue(cpu.fields?.turboClock) ?? '--';
    return `${clock} / ${turboClock}`;
  }, [cpu]);

  const highlightMemory = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.memorySupport) ?? '--';
  }, [cpu]);

  const highlightReleaseDate = useMemo(() => {
    return productFieldFormattedValue(cpu.fields?.releaseDate) ?? '--';
  }, [cpu.fields?.releaseDate]);

  const cpuAffiliateUrl = useMemo(() => getCpuAffiliateUrl(cpu), [cpu]);

  return (
    <div
      className={classNames(
        'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4 mb-4',
        className,
      )}
    >
      <ProductHighlight
        icon={<StarIcon />}
        label="Performance Rating"
        value={highlightPerformance}
      />

      <ProductHighlight
        icon={<CurrencyDollarIcon />}
        label="Value Rating"
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
              <AmazonButton
                href={cpuAffiliateUrl}
                target="_blank"
                rel="noopener nofollow"
              >
                Check Price on Amazon
              </AmazonButton>
            }
            className="flex-none"
          />
          {cpuAffiliateUrl && <AffiliateDisclaimer />}
        </div>
      )}
    </div>
  );
};
