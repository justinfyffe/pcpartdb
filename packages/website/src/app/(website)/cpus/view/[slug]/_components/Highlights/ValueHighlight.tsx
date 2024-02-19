'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  getProductBenchmarkName,
  productBenchmarkValuePerMsrp,
  ProductType,
  ViewCpuViewModel,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlight } from 'packages/website/src/app/_common/product/components/ProductHighlight/ProductHighlight';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useMemo } from 'react';

interface ValueHighlightProps {
  className?: string;
}

export const ValueHighlight: FunctionComponent<ValueHighlightProps> = (
  props,
) => {
  const { className } = props;

  const { viewModel, updateViewModel } =
    useViewModelContext<ViewCpuViewModel>();
  const cpu = viewModel.cpu;
  const bestValueCpu = viewModel.contentData?.bestValueCpu;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [cpu.id],
    onChange: updateViewModel,
  });

  const valueScore = useMemo(
    () => productBenchmarkValuePerMsrp(cpu, preferredBenchmark),
    [cpu, preferredBenchmark],
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
    if (valueScore == null || bestValueCpu == null) {
      return null;
    }
    const bestScore = productBenchmarkValuePerMsrp(
      bestValueCpu,
      preferredBenchmark,
    );
    if (bestScore === valueScore) {
      return 'Best Value';
    }

    const pct = ((valueScore / bestScore) * 100).toFixed(0);
    return `${pct}% of ${bestScore.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;
  }, [valueScore, bestValueCpu, preferredBenchmark]);

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
};
