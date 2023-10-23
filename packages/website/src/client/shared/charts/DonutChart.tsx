import React, { FunctionComponent, useMemo } from 'react';
import { classNames } from '../ui/classNames';

export interface DonutChartData {
  value: number;
  color: string;
}

interface DonutChartPart {
  color: string;
  count: number;
  startDegrees: number;
  endDegrees: number;
}

export interface DonutChartProps {
  data: DonutChartData[];
  totalValue?: number;
  centerLabel?: string;

  chartClass: string;
  holeClass: string;
}

export const DonutChart: FunctionComponent<DonutChartProps> = (props) => {
  const data = props.data;

  const sumOfParts = useMemo(
    () => data.reduce((acc, d) => acc + d.value, 0),
    [data],
  );

  const totalValue = useMemo(
    () => props.totalValue ?? sumOfParts,
    [props.totalValue, sumOfParts],
  );

  const fillerData = useMemo(
    () => ({
      value: totalValue - sumOfParts,
      color: '#aaa',
    }),
    [sumOfParts, totalValue],
  );

  const cssString = useMemo(
    () =>
      [...data, fillerData]
        .reduce((parts, item, i) => {
          const { value, color } = item;

          const part: DonutChartPart = {
            color,
            count: 0,
            startDegrees: 0,
            endDegrees: 0,
          };
          part.count += parts[i - 1]?.count || part.count;

          const startValue = parts[i - 1]?.count ? parts[i - 1].count : 0;
          const endValue = (part.count += value);
          const startPercent = Math.round((startValue / totalValue) * 100);
          const endPercent = Math.round((endValue / totalValue) * 100);
          part.startDegrees = Math.round((startPercent / 100) * 360);
          part.endDegrees = Math.round((endPercent / 100) * 360);

          parts.push(part);
          return parts;
        }, [] as DonutChartPart[])
        .map((item) => {
          const { color, startDegrees, endDegrees } = item;
          return ` ${color} ${startDegrees}deg ${endDegrees}deg`;
        })
        .join(),
    [data, fillerData, totalValue],
  );

  return (
    <div className={classNames('relative', props.chartClass)}>
      <div className="absolute flex w-full h-full items-center justify-center">
        <div
          className={classNames(
            'rounded-full bg-white flex items-center justify-center text-lg font-medium',
            props.holeClass,
          )}
        >
          {props.centerLabel}
        </div>
      </div>
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${cssString})`,
        }}
      />
    </div>
  );
};
