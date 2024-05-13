'use client';

import { StarIcon } from '@heroicons/react/24/outline';
import {
  CompareGpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  percentDifference,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import { useRelativeDataProducts } from 'packages/website/src/app/_common/product/contexts/RelativeDataProductsProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useMemo } from 'react';

interface PerformanceHighlightListItemProps {
  className?: string;
}

export const PerformanceHighlightListItem: FunctionComponent<
  PerformanceHighlightListItemProps
> = (props) => {
  const { className } = props;

  const { viewModel } = useViewModelContext<CompareGpusViewModel>();
  const [gpu1, gpu2] = viewModel.comparison;
  const { loading } = useRelativeDataProducts();

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu1.id, gpu2.id],
  });

  const values = useMemo(() => {
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const perf1 =
      productBenchmarkValue(gpu1, preferredBenchmark)?.toLocaleString() ?? '--';
    const perf2 =
      productBenchmarkValue(gpu2, preferredBenchmark)?.toLocaleString() ?? '--';

    const bold1 =
      productBenchmarkValue(gpu1, preferredBenchmark) >
      productBenchmarkValue(gpu2, preferredBenchmark);
    const bold2 =
      productBenchmarkValue(gpu1, preferredBenchmark) <
      productBenchmarkValue(gpu2, preferredBenchmark);

    const rawValue1 = productBenchmarkValue(gpu1, preferredBenchmark);
    const rawValue2 = productBenchmarkValue(gpu2, preferredBenchmark);
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
      { name: name1, value: perf1, bold: bold1, extra: diff1 },
      { name: name2, value: perf2, bold: bold2, extra: diff2 },
    ];
  }, [gpu1, gpu2, preferredBenchmark]);

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
          </span>
        </Button>
      }
      values={values}
      className={className}
      loading={loading}
    ></ProductHighlightComparison>
  );
};
