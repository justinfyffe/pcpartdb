import {
  formatOrdinalNumber,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { DonutChart } from 'packages/website/src/client/shared/charts/DonutChart';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { classNames } from 'packages/website/src/client/shared/ui/classNames';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface PerformanceAndValueChartsProps {
  className?: string;
}

export const PerformanceAndValueCharts: FunctionComponent<
  PerformanceAndValueChartsProps
> = (props) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);
  const { parent } = gpu;

  const performanceRank = useMemo(
    () =>
      formatOrdinalNumber(
        gpu.ranks.performanceRating ?? parent?.ranks?.performanceRating ?? null,
      ),
    [gpu.ranks.performanceRating, parent?.ranks?.performanceRating],
  );
  const valueRank = useMemo(
    () =>
      formatOrdinalNumber(
        gpu.ranks.performancePerMsrp ??
          parent?.ranks?.performancePerMsrp ??
          null,
      ),
    [gpu.ranks.performancePerMsrp, parent?.ranks?.performancePerMsrp],
  );

  const performanceRatingRaw = useMemo(() => {
    return (
      productFieldRawValue(gpu.fields?.performanceRating) ||
      productFieldRawValue(parent?.fields?.performanceRating)
    );
  }, [gpu.fields?.performanceRating, parent?.fields?.performanceRating]);

  const valueRatingRaw = useMemo(() => {
    return (
      productFieldRawValue(gpu.fields?.performancePerMsrp) ||
      productFieldRawValue(parent?.fields?.performancePerMsrp)
    );
  }, [gpu.fields?.performancePerMsrp, parent?.fields?.performancePerMsrp]);

  const performanceRating = useMemo(() => {
    const performanceScore =
      productFieldFormattedValue(gpu.fields?.performanceRating) ||
      productFieldFormattedValue(parent?.fields?.performanceRating);

    return `${performanceScore || '--'}`;
  }, [gpu.fields?.performanceRating, parent?.fields?.performanceRating]);

  const valueRating = useMemo(() => {
    const valueScore =
      productFieldFormattedValue(gpu.fields?.performancePerMsrp) ||
      productFieldFormattedValue(parent?.fields?.performancePerMsrp);

    return `${valueScore || '--'}`;
  }, [gpu.fields?.performancePerMsrp, parent?.fields?.performancePerMsrp]);

  return (
    <div className={classNames('flex flex-wrap gap-4', className)}>
      {/* TODO: Move to a widget that can be shared between pages */}
      <Card className="flex-1 flex flex-row justify-between items-start">
        <CardTitle as="div" className="flex flex-col gap-2">
          <span>Performance Rating</span>
          <span className="text-dimmed text-sm font-normal">
            Based on a combination of GPU benchmarks. Measured on a scale of
            0-100 with higher ratings indicating better performance.
          </span>
        </CardTitle>

        <CardContent className="gap-0 items-center">
          <DonutChart
            centerLabel={performanceRating}
            chartClass="w-24 h-24  rounded-full ring-1 ring-white"
            holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
            data={[
              { name: '', value: performanceRatingRaw, color: '#4c5c7c' },
              {
                name: '',
                value: 100 - performanceRatingRaw,
                color: '#aaa',
              },
            ]}
          ></DonutChart>
          <a href="#" className="text-xs text-dimmed font-medium underline">
            {performanceRank} in GPUs
          </a>
        </CardContent>
      </Card>

      {/* TODO: Move to a widget that can be shared between pages */}
      <Card className="flex-1 flex flex-row justify-between items-start">
        <CardTitle as="div" className="flex flex-col gap-2">
          <span>Value Rating</span>
          <span className="text-dimmed text-sm font-normal">
            Based on the GPU&apos;s performance per dollar (MSRP). Measured on a
            scale of 0-100 with higher ratings indicating better value.
          </span>
        </CardTitle>
        <CardContent className="gap-1 items-center">
          <DonutChart
            centerLabel={valueRating}
            chartClass="w-24 h-24 rounded-full ring-1 ring-white"
            holeClass="w-[75%] h-[75%] bg-light-shades rounded-full ring-1 ring-white"
            data={[
              { name: '', value: valueRatingRaw, color: '#4c5c7c' },
              {
                name: '',
                value: 100 - valueRatingRaw,
                color: '#aaa',
              },
            ]}
          ></DonutChart>
          <a href="#" className="text-xs text-dimmed font-medium underline">
            {valueRank} in GPUs
          </a>
        </CardContent>
      </Card>
    </div>
  );
};
