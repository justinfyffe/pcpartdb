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
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { useMemo } from 'react';

interface ValueHighlightProps {
  className?: string;
}

export function ValueHighlight(props: ValueHighlightProps) {
  const { className } = props;

  const { viewModel, updateViewModel } =
    useViewModelContext<ViewGpuViewModel>();
  const gpu = viewModel.gpu;
  const parent = getGpuChipset(gpu);
  const bestValueGpu = viewModel.contentData?.bestValueGpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu.id],
    onChange: updateViewModel,
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
    if (bestScore === valueScore) {
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
            <span className="text-xs">(change)</span>
          </span>
        </Button>
      }
      value={
        <div className="flex flex-col gap-1 items-end">
          <div className="flex flex-col gap-1 items-center">
            <span>{highlightValue}</span>
            <span className="text-sm">{valueDiff}</span>
          </div>
        </div>
      }
      className={className}
    />
  );
}
