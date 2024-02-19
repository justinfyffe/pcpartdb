'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import {
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValue,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { useMemo } from 'react';

interface PerformanceHighlightProps {
  className?: string;
}

export function PerformanceHighlight(props: PerformanceHighlightProps) {
  const { className } = props;

  const { viewModel, updateViewModel } =
    useViewModelContext<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const parent = getGpuChipset(gpu);
  const bestPerfGpu = viewModel.contentData?.bestPerformanceGpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    onChange: updateViewModel,
  });

  const score = useMemo(
    () =>
      productBenchmarkValue(gpu, preferredBenchmark) ||
      productBenchmarkValue(parent, preferredBenchmark),
    [gpu, parent, preferredBenchmark],
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
    if (bestScore === score) {
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
            <span className="text-xs">(change)</span>
          </span>
        </Button>
      }
      value={
        <div className="flex flex-col gap-1 items-end">
          <div className="flex flex-col gap-1 items-center">
            <span>{valueText}</span>
            <span className="text-sm">{diffText}</span>
          </div>
        </div>
      }
      className={className}
    />
  );
}
