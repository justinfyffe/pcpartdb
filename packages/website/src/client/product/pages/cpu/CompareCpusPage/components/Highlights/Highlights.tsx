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
  DateFormat,
  formatCpuField,
  formatCpuName,
  getCpuAffiliateUrl,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import { classNames } from 'packages/website/src/client/shared/ui';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [cpu1, cpu2] = context.comparison;

  const cpu1Name = useMemo(
    () => formatCpuName(cpu1, { company: false, brand: true }),
    [cpu1],
  );
  const cpu2Name = useMemo(
    () => formatCpuName(cpu2, { company: false, brand: true }),
    [cpu2],
  );

  const highlightPerformance = useMemo(() => {
    const value1 = formatCpuField(cpu1.performanceScore) || '--';
    const value2 = formatCpuField(cpu2.performanceScore) || '--';
    const bold1 = cpu1.performanceScore?.value > cpu2.performanceScore?.value;
    const bold2 = cpu2.performanceScore?.value > cpu1.performanceScore?.value;

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [cpu1.performanceScore, cpu1Name, cpu2.performanceScore, cpu2Name]);

  const highlightValue = useMemo(() => {
    const value1 = formatCpuField(cpu1.valueScore) || '--';
    const value2 = formatCpuField(cpu2.valueScore) || '--';
    const bold1 = cpu1.valueScore?.value > cpu2.valueScore?.value;
    const bold2 = cpu2.valueScore?.value > cpu1.valueScore?.value;

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [cpu1.valueScore, cpu1Name, cpu2.valueScore, cpu2Name]);

  const highlightCoresThreads = useMemo(() => {
    const cores1 = formatCpuField(cpu1.coresCount) || '--';
    const threads1 = formatCpuField(cpu1.threadsCount) || '--';
    const value1 = `${cores1} / ${threads1}`;

    const cores2 = formatCpuField(cpu2.coresCount) || '--';
    const threads2 = formatCpuField(cpu2.threadsCount) || '--';
    const value2 = `${cores2} / ${threads2}`;

    return [
      { name: cpu1Name, value: value1, bold: value1 > value2 },
      { name: cpu2Name, value: value2, bold: value2 > value1 },
    ];
  }, [
    cpu1.coresCount,
    cpu1.threadsCount,
    cpu1Name,
    cpu2.coresCount,
    cpu2.threadsCount,
    cpu2Name,
  ]);

  const highlightMemory = useMemo(() => {
    let value1 = formatCpuField(cpu1.memorySupport) || '--';
    if (value1.indexOf(',') >= 0) {
      value1 = value1.substring(0, value1.indexOf(','));
    }

    let value2 = formatCpuField(cpu2.memorySupport) || '--';
    if (value2.indexOf(',') >= 0) {
      value2 = value2.substring(0, value2.indexOf(','));
    }

    return [
      { name: cpu1Name, value: value1, bold: false },
      { name: cpu2Name, value: value2, bold: false },
    ];
  }, [cpu1.memorySupport, cpu1Name, cpu2.memorySupport, cpu2Name]);

  const highlightClock = useMemo(() => {
    const clock1 = formatCpuField(cpu1.clock) || '--';
    const turboClock1 = formatCpuField(cpu1.turboClock) || '--';
    const value1 = `${clock1} / ${turboClock1}`;
    const rawClock1 = cpu1.clock?.value ?? 0;
    const rawTurbo1 = cpu1.turboClock?.value ?? rawClock1;

    const clock2 = formatCpuField(cpu2.clock) || '--';
    const turboClock2 = formatCpuField(cpu2.turboClock) || '--';
    const value2 = `${clock2} / ${turboClock2}`;
    const rawClock2 = cpu2.clock?.value ?? 0;
    const rawTurbo2 = cpu2.turboClock?.value ?? rawClock2;

    const bold1 = rawClock1 > rawClock2 && rawTurbo1 > rawTurbo2;
    const bold2 = rawClock2 > rawClock1 && rawTurbo2 > rawTurbo1;

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [
    cpu1.clock,
    cpu1.turboClock,
    cpu1Name,
    cpu2.clock,
    cpu2.turboClock,
    cpu2Name,
  ]);

  const highlightReleaseDate = useMemo(() => {
    const value1 = formatCpuField(cpu1.releaseDate) || '--';
    const value2 = formatCpuField(cpu2.releaseDate) || '--';

    const dateFormat = DateFormat.YearQuarter;
    const date1 = formatCpuField(cpu1.releaseDate, { dateFormat });
    const date2 = formatCpuField(cpu2.releaseDate, { dateFormat });

    return [
      { name: cpu1Name, value: value1, bold: date1 > date2 },
      { name: cpu2Name, value: value2, bold: date2 > date1 },
    ];
  }, [cpu1.releaseDate, cpu1Name, cpu2.releaseDate, cpu2Name]);

  const cpuAffiliateUrl1 = useMemo(() => getCpuAffiliateUrl(cpu1), [cpu1]);
  const cpuAffiliateUrl2 = useMemo(() => getCpuAffiliateUrl(cpu2), [cpu2]);

  return (
    <div>
      <div
        className={classNames(
          'grid grid-cols-2 lg:flex flex-col md:gap-3 gap-4',
          className,
        )}
      >
        <ProductHighlightComparison
          icon={<StarIcon />}
          label="Performance"
          values={highlightPerformance}
        />

        <ProductHighlightComparison
          icon={<CurrencyDollarIcon />}
          label="Performance / $ (MSRP)"
          values={highlightValue}
        />

        <ProductHighlightComparison
          icon={<CpuChipIcon />}
          label="Cores / Threads"
          values={highlightCoresThreads}
        />

        <ProductHighlightComparison
          icon={<CircleStackIcon />}
          label="Memory"
          values={highlightMemory}
        />

        <ProductHighlightComparison
          icon={<ClockIcon />}
          label="Clock"
          values={highlightClock}
        />

        <ProductHighlightComparison
          icon={<CalendarDaysIcon />}
          label="Release Date"
          values={highlightReleaseDate}
        />

        {cpuAffiliateUrl1 && (
          <div className="flex flex-col">
            <div className="bg-light-shades flex flex-col px-4 py-2 rounded shadow gap-4">
              <div className="flex-1 flex gap-2 items-center mr-auto">
                <div className="mr-1">
                  <ShoppingCartIcon className="w-5" />
                </div>

                <div className="font-medium md:text-base text-xl">
                  Shop {cpu1Name}
                </div>
              </div>

              <div className="flex-1 md:text-base text-content text-right whitespace-nowrap ml-auto">
                <WarningButton
                  href={cpuAffiliateUrl1}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Check Price on Amazon
                </WarningButton>
              </div>
            </div>
            {!cpuAffiliateUrl2 && <AffiliateDisclaimer />}
          </div>
        )}

        {cpuAffiliateUrl2 && (
          <div className="flex flex-col">
            <div className="bg-light-shades flex flex-col px-4 py-2 rounded shadow gap-4">
              <div className="flex-1 flex gap-2 items-center mr-auto">
                <div className="mr-1">
                  <ShoppingCartIcon className="w-5" />
                </div>

                <div className="font-medium md:text-base text-xl">
                  Shop {cpu2Name}
                </div>
              </div>

              <div className="flex-1 md:text-base text-content text-right whitespace-nowrap ml-auto">
                <WarningButton
                  href={cpuAffiliateUrl2}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Check Price on Amazon
                </WarningButton>
              </div>
            </div>
            <AffiliateDisclaimer />
          </div>
        )}
      </div>
    </div>
  );
};
