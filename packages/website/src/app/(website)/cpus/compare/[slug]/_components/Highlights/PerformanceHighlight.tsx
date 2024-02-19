'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useMemo } from 'react';

interface PerformanceHighlightProps {
  className?: string;
}

export const PerformanceHighlight: FunctionComponent<
  PerformanceHighlightProps
> = (props) => {
  const { className } = props;

  const { viewModel, updateViewModel } =
    useViewModelContext<CompareCpusViewModel>();
  const [cpu1, cpu2] = viewModel.comparison;

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [cpu1.id, cpu2.id],
    onChange: updateViewModel,
  });

  const values = useMemo(() => {
    const name1 = formatProductName(cpu1, { company: false, brand: true });
    const name2 = formatProductName(cpu2, { company: false, brand: true });

    const perf1 =
      productBenchmarkValue(cpu1, preferredBenchmark)?.toLocaleString() ?? '--';
    const perf2 =
      productBenchmarkValue(cpu2, preferredBenchmark)?.toLocaleString() ?? '--';

    const bold1 =
      productBenchmarkValue(cpu1, preferredBenchmark) >
      productBenchmarkValue(cpu2, preferredBenchmark);
    const bold2 =
      productBenchmarkValue(cpu1, preferredBenchmark) <
      productBenchmarkValue(cpu2, preferredBenchmark);

    const rawValue1 = productBenchmarkValue(cpu1, preferredBenchmark);
    const rawValue2 = productBenchmarkValue(cpu2, preferredBenchmark);
    let diff1: string = null;
    let diff2: string = null;
    if (rawValue1 && rawValue2) {
      if (rawValue1 > rawValue2) {
        const pct = ((rawValue1 / rawValue2 - 1) * 100).toLocaleString(
          'en-US',
          { maximumFractionDigits: 2 },
        );
        diff1 = `(+${pct}%)`;
      } else if (rawValue2 > rawValue1) {
        const pct = ((rawValue2 / rawValue1 - 1) * 100).toLocaleString(
          'en-US',
          { maximumFractionDigits: 2 },
        );
        diff2 = `(+${pct}%)`;
      }
    }

    return [
      { name: name1, value: perf1, bold: bold1, extra: diff1 },
      { name: name2, value: perf2, bold: bold2, extra: diff2 },
    ];
  }, [cpu1, cpu2, preferredBenchmark]);

  return (
    <ProductHighlightComparison
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
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
