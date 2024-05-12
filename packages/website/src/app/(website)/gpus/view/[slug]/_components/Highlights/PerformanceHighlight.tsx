'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import {
  getProductBenchmarkName,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { Skeleton } from 'packages/website/src/app/_common/components/Skeleton/Skeleton';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React, { useMemo } from 'react';
import { usePageContext } from '../../PageProvider';

interface PerformanceHighlightProps {
  className?: string;
}

export function PerformanceHighlight(props: PerformanceHighlightProps) {
  const { className } = props;

  const { viewModel } = usePageContext();
  const gpu = viewModel.gpu;
  const { relativeDataProducts, loading } = useRelativeDataProducts();
  const bestPerfGpu = relativeDataProducts?.bestBenchmarkPerformance;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { selectedGame } = useGameSelection();
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    gameSlug: selectedGame?.slug,
  });

  const score = useMemo(
    () => productBenchmarkValue(gpu, preferredBenchmark),
    [gpu, preferredBenchmark],
  );

  const valueText = useMemo(() => {
    if (score != null) {
      return `${score.toLocaleString()}`;
    } else {
      return '--';
    }
  }, [score]);

  const diffText = useMemo(() => {
    if (score == null || bestPerfGpu == null) {
      return null;
    }

    const bestScore = productBenchmarkValue(bestPerfGpu, preferredBenchmark);
    if (bestScore == null) {
      return '--';
    } else if (bestScore === score) {
      return 'Best Performance';
    }

    const pct = ((score / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString()}`;
  }, [bestPerfGpu, score, preferredBenchmark]);

  return (
    <ProductHighlight
      icon={<StarIcon />}
      label={
        <Button
          variant={ButtonVariant.Link}
          className="text-content flex flex-col"
          onClick={showPreferredBenchmarkDialog}
        >
          <span>Performance</span>
          <span className="text-link text-sm flex gap-2 items-baseline">
            {getProductBenchmarkName(preferredBenchmark)}
            <span className="text-xs lg:hidden">(change)</span>
          </span>
        </Button>
      }
      value={
        <div className="flex flex-col gap-1 items-end">
          {!loading && (
            <div className="flex flex-col gap-1 items-center">
              <span>{valueText}</span>
              <span className="text-sm">{diffText}</span>
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-3 h-[49px] justify-center">
              <Skeleton className="w-20 h-3" pulse />
              <Skeleton className="w-20 h-3" pulse />
            </div>
          )}
        </div>
      }
      className={className}
    />
  );
}
