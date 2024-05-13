'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  percentDifference,
  productBenchmarkValuePerMsrp,
  ProductType,
  RelativeDataProducts,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useCallback, useMemo } from 'react';

interface ValueHighlightProps {
  className?: string;
}

export const ValueHighlight: FunctionComponent<ValueHighlightProps> = (
  props,
) => {
  const { className } = props;

  const { viewModel } = useViewModelContext<CompareCpusViewModel>();
  const [cpu1, cpu2] = viewModel.comparison;
  const { loading } = useRelativeDataProducts();

  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    softReload: true,
    productIds: [cpu1.id, cpu2.id],
  });

  const values = useMemo(() => {
    const name1 = formatProductName(cpu1, { company: false, brand: true });
    const name2 = formatProductName(cpu2, { company: false, brand: true });

    const value1 =
      productBenchmarkValuePerMsrp(cpu1, preferredBenchmark)?.toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 },
      ) ?? '--';
    const value2 =
      productBenchmarkValuePerMsrp(cpu2, preferredBenchmark)?.toLocaleString(
        'en-US',
        { maximumFractionDigits: 2 },
      ) ?? '--';

    const bold1 =
      productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) >
      productBenchmarkValuePerMsrp(cpu2, preferredBenchmark);
    const bold2 =
      productBenchmarkValuePerMsrp(cpu1, preferredBenchmark) <
      productBenchmarkValuePerMsrp(cpu2, preferredBenchmark);

    const rawValue1 = productBenchmarkValuePerMsrp(cpu1, preferredBenchmark);
    const rawValue2 = productBenchmarkValuePerMsrp(cpu2, preferredBenchmark);
    let diff1: string = null;
    let diff2: string = null;
    if (rawValue1 && rawValue2) {
      if (rawValue1 > rawValue2) {
        const pct = (
          percentDifference(rawValue2, rawValue1) * 100
        ).toLocaleString('en-US', { maximumFractionDigits: 2 });
        diff1 = `(+${pct}%)`;
      } else if (rawValue2 > rawValue1) {
        const pct = (
          percentDifference(rawValue1, rawValue2) * 100
        ).toLocaleString('en-US', { maximumFractionDigits: 2 });
        diff2 = `(+${pct}%)`;
      }
    }

    return [
      { name: name1, value: value1, bold: bold1, extra: diff1 },
      { name: name2, value: value2, bold: bold2, extra: diff2 },
    ];
  }, [cpu1, cpu2, preferredBenchmark]);

  return (
    <ProductHighlightComparison
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
          </span>
        </Button>
      }
      values={values}
      className={className}
      loading={loading}
    ></ProductHighlightComparison>
  );
};
