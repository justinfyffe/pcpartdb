'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewGpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { useGameSelection } from 'packages/website/src/app/_common/game/contexts/GameSelectionProvider';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React, { useMemo } from 'react';

interface ValueHighlightProps {
  className?: string;
}

export function ValueHighlight(props: ValueHighlightProps) {
  const { className } = props;

  const { viewModel } = useViewModelContext<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const parent = getGpuChipset(gpu);
  const bestValueGpu =
    viewModel.relativeDataProducts?.bestBenchmarkPerformancePerDollar;
  const { loading } = useRelativeDataProducts();

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { selectedGame } = useGameSelection();
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    gameSlug: selectedGame?.slug,
  });

  const valueScore = useMemo(
    () =>
      productBenchmarkValuePerMsrp(gpu, preferredBenchmark) ||
      productBenchmarkValuePerMsrp(parent, preferredBenchmark),
    [gpu, parent, preferredBenchmark],
  );

  const highlightValue = useMemo(() => {
    if (valueScore != null) {
      return `${valueScore.toLocaleString('en-US', {
        maximumFractionDigits: 2,
      })}`;
    } else {
      return '--';
    }
  }, [valueScore]);

  const valueDiff = useMemo(() => {
    if (valueScore == null || bestValueGpu == null) {
      return null;
    }
    const bestScore = productBenchmarkValuePerMsrp(
      bestValueGpu,
      preferredBenchmark,
    );
    if (bestScore == null) {
      return '--';
    } else if (bestScore === valueScore) {
      return 'Best Value';
    }

    const pct = ((valueScore / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;
  }, [valueScore, bestValueGpu, preferredBenchmark]);

  return (
    <ProductHighlight
      icon={<CurrencyDollarIcon />}
      label={
        <Button
          variant={ButtonVariant.Link}
          className="text-content flex flex-col"
          onClick={showPreferredBenchmarkDialog}
        >
          <span>Performance Per Dollar</span>
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
              <span>{highlightValue}</span>
              <span className="text-sm">{valueDiff}</span>
            </div>
          )}

          {/* {loading && <Spinner className="w-8 h-8" />} */}
          {loading && (
            <div className="animate-pulse flex flex-col gap-3 h-[49px] justify-center">
              <div className="w-20 h-3 bg-loading rounded" />
              <div className="w-20 h-3 bg-loading rounded" />
            </div>
          )}
        </div>
      }
      className={className}
    />
  );
}
