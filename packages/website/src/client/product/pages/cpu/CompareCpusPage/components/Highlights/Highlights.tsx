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
  formatProductName,
  getCpuAffiliateUrl,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import { AffiliateDisclaimer } from 'packages/website/src/client/shared/components/AffiliateDisclaimer/AffiliateDisclaimer';
import { WarningButton } from 'packages/website/src/client/shared/components/Button/WarningButton';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface HighlightsProps {
  className?: string;
}

export const Highlights: FunctionComponent<HighlightsProps> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [cpu1, cpu2] = context.comparison;

  const cpu1Name = useMemo(
    () => formatProductName(cpu1, { company: false, brand: true }),
    [cpu1],
  );
  const cpu2Name = useMemo(
    () => formatProductName(cpu2, { company: false, brand: true }),
    [cpu2],
  );

  const highlightPerformance = useMemo(() => {
    const value1 =
      productFieldFormattedValue(cpu1.fields?.performanceRating) ?? '--';
    const value2 =
      productFieldFormattedValue(cpu2.fields?.performanceRating) ?? '--';
    const bold1 =
      productFieldRawValue(cpu1.fields?.performanceRating) >
      productFieldRawValue(cpu2.fields?.performanceRating);
    const bold2 =
      productFieldRawValue(cpu1.fields?.performanceRating) <
      productFieldRawValue(cpu2.fields?.performanceRating);

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [
    cpu1.fields?.performanceRating,
    cpu1Name,
    cpu2.fields?.performanceRating,
    cpu2Name,
  ]);

  const highlightValue = useMemo(() => {
    const value1 =
      productFieldFormattedValue(cpu1.fields?.performancePerMsrp) ?? '--';
    const value2 =
      productFieldFormattedValue(cpu2.fields?.performancePerMsrp) ?? '--';
    const bold1 =
      productFieldRawValue(cpu1.fields.performancePerMsrp) >
      productFieldRawValue(cpu2.fields.performancePerMsrp);
    const bold2 =
      productFieldRawValue(cpu1.fields.performancePerMsrp) <
      productFieldRawValue(cpu2.fields.performancePerMsrp);

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [
    cpu1.fields.performancePerMsrp,
    cpu1Name,
    cpu2.fields.performancePerMsrp,
    cpu2Name,
  ]);

  const highlightCoresThreads = useMemo(() => {
    const cores1 = productFieldFormattedValue(cpu1.fields?.cores) ?? '--';
    const threads1 = productFieldFormattedValue(cpu1.fields?.threads) ?? '--';
    const value1 = `${cores1} / ${threads1}`;

    const cores2 = productFieldFormattedValue(cpu2.fields?.cores) ?? '--';
    const threads2 = productFieldFormattedValue(cpu2.fields?.threads) ?? '--';
    const value2 = `${cores2} / ${threads2}`;

    const bold1 =
      productFieldRawValue(cpu1.fields?.cores) >
      productFieldRawValue(cpu2.fields?.cores);
    const bold2 =
      productFieldRawValue(cpu1.fields?.cores) <
      productFieldRawValue(cpu2.fields?.cores);

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [
    cpu1.fields?.cores,
    cpu1.fields?.threads,
    cpu1Name,
    cpu2.fields?.cores,
    cpu2.fields?.threads,
    cpu2Name,
  ]);

  const highlightMemory = useMemo(() => {
    let value1 = productFieldFormattedValue(cpu1.fields?.memorySupport) ?? '--';
    if (value1.indexOf(',') >= 0) {
      value1 = value1.substring(0, value1.indexOf(','));
    }

    let value2 = productFieldFormattedValue(cpu2.fields?.memorySupport) ?? '--';
    if (value2.indexOf(',') >= 0) {
      value2 = value2.substring(0, value2.indexOf(','));
    }

    return [
      { name: cpu1Name, value: value1, bold: false },
      { name: cpu2Name, value: value2, bold: false },
    ];
  }, [
    cpu1.fields?.memorySupport,
    cpu1Name,
    cpu2.fields?.memorySupport,
    cpu2Name,
  ]);

  const highlightClock = useMemo(() => {
    const clock1 = productFieldFormattedValue(cpu1.fields?.clock) ?? '--';
    const turboClock1 =
      productFieldFormattedValue(cpu1.fields?.turboClock) ?? '--';
    const value1 = `${clock1} / ${turboClock1}`;
    const rawClock1 = productFieldRawValue(cpu1.fields?.clock) ?? 0;
    const rawTurbo1 =
      productFieldRawValue(cpu1.fields?.turboClock) ?? rawClock1;

    const clock2 = productFieldFormattedValue(cpu2.fields?.clock) ?? '--';
    const turboClock2 =
      productFieldFormattedValue(cpu2.fields?.turboClock) ?? '--';
    const value2 = `${clock2} / ${turboClock2}`;
    const rawClock2 = productFieldRawValue(cpu2.fields?.clock) ?? 0;
    const rawTurbo2 =
      productFieldRawValue(cpu2.fields?.turboClock) ?? rawClock2;

    const bold1 = rawClock1 > rawClock2 && rawTurbo1 > rawTurbo2;
    const bold2 = rawClock2 > rawClock1 && rawTurbo2 > rawTurbo1;

    return [
      { name: cpu1Name, value: value1, bold: bold1 },
      { name: cpu2Name, value: value2, bold: bold2 },
    ];
  }, [
    cpu1.fields?.clock,
    cpu1.fields?.turboClock,
    cpu1Name,
    cpu2.fields?.clock,
    cpu2.fields?.turboClock,
    cpu2Name,
  ]);

  const highlightReleaseDate = useMemo(() => {
    const value1 = productFieldFormattedValue(cpu1.fields?.releaseDate) ?? '--';
    const value2 = productFieldFormattedValue(cpu2.fields?.releaseDate) ?? '--';

    const date1 = productFieldRawValue(cpu1.fields?.releaseDate);
    const date2 = productFieldRawValue(cpu2.fields?.releaseDate);

    return [
      { name: cpu1Name, value: value1, bold: date1 > date2 },
      { name: cpu2Name, value: value2, bold: date2 > date1 },
    ];
  }, [cpu1.fields?.releaseDate, cpu1Name, cpu2.fields?.releaseDate, cpu2Name]);

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
          label="Performance Rating"
          values={highlightPerformance}
        />

        <ProductHighlightComparison
          icon={<CurrencyDollarIcon />}
          label="Value Rating"
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
