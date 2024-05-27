'use client';

import { Product } from '@pcpartdb/shared';
import { ProgressBarChart } from 'packages/website/src/app/_common/components/charts/ProgressBarChart';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValuePerMsrp } from '../../../../hooks/useBenchmarkValuePerMsrp';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { useProductName } from '../../../../hooks/useProductName';
import { usePercentHigherLabel } from '../../usePercentHigherLabel';
import { usePercentOfLabel } from '../../usePercentOfLabel';
import { useScoreLabel } from '../../useScoreLabel';

interface PerformancePerDollarChartProps {
  product: Partial<Product>;
  otherProduct: Partial<Product>;
}

export const PerformancePerDollarChart = (
  props: PerformancePerDollarChartProps,
) => {
  const { product, otherProduct } = props;
  const productType = product.productType;

  const { relativeDataProducts, loading } = useRelativeDataProducts();
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformancePerDollar;
  const preferredBenchmark = usePreferredBenchmark(productType);

  const productName = useProductName(product, { company: false });
  const score = useBenchmarkValuePerMsrp(product, preferredBenchmark);
  const otherScore = useBenchmarkValuePerMsrp(otherProduct, preferredBenchmark);
  const bestScore = useBenchmarkValuePerMsrp(bestProduct, preferredBenchmark);
  const percentOfBest = usePercentOf(score, bestScore);

  const scoreLabel = useScoreLabel({
    score,
    isNullLabel: 'No data available',
    maxDecimals: 2,
  });
  const percentHigherLabel = usePercentHigherLabel({
    higher: score,
    lower: otherScore,
    maxDecimals: 0,
  });
  const percentOfBestLabel = usePercentOfLabel({
    baseValue: score,
    maxValue: bestScore,
    isMaxLabel: 'Best Value',
    percentMaxDecimals: 0,
    maxValueMaxDecimals: 2,
  });

  return (
    <div
      className={classNames(
        'flex flex-col gap-1',
        percentHigherLabel ? 'font-medium' : '',
      )}
    >
      <div className="flex justify-between">
        <span className="whitespace-nowrap text-ellipsis overflow-hidden">
          {productName}
        </span>
        {percentHigherLabel && (
          <span className="whitespace-nowrap">{percentHigherLabel} better</span>
        )}
      </div>

      <ProgressBarChart percent={percentOfBest} loading={loading} />

      <div className="flex flex-1 justify-between gap-4">
        <span>{scoreLabel}</span>
        {!loading && <span>{percentOfBestLabel}</span>}
      </div>
    </div>
  );
};
