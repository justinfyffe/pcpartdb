'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValuePerMsrp,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { useViewModelContext } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { ProductHighlightComparison } from 'packages/website/src/app/_common/product/components/ProductHighlightComparison/ProductHighlightComparison';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useMemo } from 'react';

interface ValueHighlightListItemProps {
  className?: string;
}

export const ValueHighlightListItem: FunctionComponent<
  ValueHighlightListItemProps
> = (props) => {
  const { className } = props;

  const { viewModel, updateViewModel } =
    useViewModelContext<CompareGpusViewModel>();
  const [gpu1, gpu2] = viewModel.comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);

  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    softReload: true,
    productIds: [gpu1.id, gpu2.id],
    onChange: updateViewModel,
  });

  const values = useMemo(() => {
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const value1 =
      productBenchmarkValuePerMsrp(
        chipset1,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }) ?? '--';
    const value2 =
      productBenchmarkValuePerMsrp(
        chipset2,
        preferredBenchmark,
      )?.toLocaleString('en-US', { maximumFractionDigits: 2 }) ?? '--';

    const bold1 =
      productBenchmarkValuePerMsrp(chipset1, preferredBenchmark) >
      productBenchmarkValuePerMsrp(chipset2, preferredBenchmark);
    const bold2 =
      productBenchmarkValuePerMsrp(chipset1, preferredBenchmark) <
      productBenchmarkValuePerMsrp(chipset2, preferredBenchmark);

    const rawValue1 = productBenchmarkValuePerMsrp(
      chipset1,
      preferredBenchmark,
    );
    const rawValue2 = productBenchmarkValuePerMsrp(
      chipset2,
      preferredBenchmark,
    );
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
      { name: name1, value: value1, bold: bold1, extra: diff1 },
      { name: name2, value: value2, bold: bold2, extra: diff2 },
    ];
  }, [chipset1, chipset2, gpu1, gpu2, preferredBenchmark]);

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
            <span className="text-xs">(change)</span>
          </span>
        </Button>
      }
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
