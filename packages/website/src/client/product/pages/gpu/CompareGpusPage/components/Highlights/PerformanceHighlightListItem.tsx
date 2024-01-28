import { StarIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  getGpuChipset,
  getProductBenchmarkName,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/client/user/hooks/usePreferredBenchmarkDialog';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContextProvider';

interface PerformanceHighlightListItemProps {
  className?: string;
}

export const PerformanceHighlightListItem: FunctionComponent<
  PerformanceHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const chipset1 = getGpuChipset(gpu1);
  const chipset2 = getGpuChipset(gpu2);
  const updateViewModel = context.updateViewModel;

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

    const perf1 =
      productBenchmarkValue(chipset1, preferredBenchmark)?.toLocaleString() ??
      '--';
    const perf2 =
      productBenchmarkValue(chipset2, preferredBenchmark)?.toLocaleString() ??
      '--';

    const bold1 =
      productBenchmarkValue(chipset1, preferredBenchmark) >
      productBenchmarkValue(chipset2, preferredBenchmark);
    const bold2 =
      productBenchmarkValue(chipset1, preferredBenchmark) <
      productBenchmarkValue(chipset2, preferredBenchmark);

    const rawValue1 = productBenchmarkValue(chipset1, preferredBenchmark);
    const rawValue2 = productBenchmarkValue(chipset2, preferredBenchmark);
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
  }, [chipset1, chipset2, gpu1, gpu2, preferredBenchmark]);

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
