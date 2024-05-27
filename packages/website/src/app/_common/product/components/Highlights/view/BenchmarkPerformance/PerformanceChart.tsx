'use client';

import { Product } from '@pcpartdb/shared';
import { ProgressBarChart } from 'packages/website/src/app/_common/components/charts/ProgressBarChart';
import { usePercentOf } from 'packages/website/src/app/_common/hooks/data/usePercentOf';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React from 'react';
import { useRelativeDataProducts } from '../../../../contexts/RelativeDataProductsProvider';
import { useBenchmarkValue } from '../../../../hooks/useBenchmarkValue';
import { usePreferredBenchmark } from '../../../../hooks/usePreferredBenchmark';
import { usePercentOfLabel } from '../../usePercentOfLabel';
import { useScoreLabel } from '../../useScoreLabel';

interface PerformanceChartProps {
  product: Partial<Product>;
}

export const PerformanceChart = (props: PerformanceChartProps) => {
  const { product } = props;
  const productType = product.productType;

  const { relativeDataProducts, loading } = useRelativeDataProducts();
  const bestProduct = relativeDataProducts?.bestBenchmarkPerformance;
  const preferredBenchmark = usePreferredBenchmark(productType);

  const score = useBenchmarkValue(product, preferredBenchmark);
  const bestScore = useBenchmarkValue(bestProduct, preferredBenchmark);
  const percentOfBest = usePercentOf(score, bestScore);

  const scoreLabel = useScoreLabel({
    score,
    isNullLabel: 'No data available',
    maxDecimals: 2,
  });
  const percentOfBestLabel = usePercentOfLabel({
    baseValue: score,
    maxValue: bestScore,
    isMaxLabel: 'Best Performance',
    percentMaxDecimals: 0,
    maxValueMaxDecimals: 2,
  });

  if (score == null) {
    return <></>;
  }

  return (
    <div className={classNames('flex flex-col gap-1')}>
      <ProgressBarChart percent={percentOfBest} loading={loading}>
        <div className="flex flex-1 justify-between gap-4">
          <span>{scoreLabel}</span>
          {!loading && <span>{percentOfBestLabel}</span>}
        </div>
      </ProgressBarChart>
    </div>
  );
};
