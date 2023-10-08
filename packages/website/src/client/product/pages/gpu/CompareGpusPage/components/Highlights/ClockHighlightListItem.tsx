import { ClockIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  productFieldFormattedValue,
  productFieldRawValue,
} from '@pcpartdb/shared';
import { ProductHighlightComparison } from 'packages/website/src/client/product/components/ProductHighlightComparison/ProductHighlightComparison';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface ClockHighlightListItemProps {
  className?: string;
}

export const ClockHighlightListItem: FunctionComponent<
  ClockHighlightListItemProps
> = (props) => {
  const { className } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;

  const values = useMemo(() => {
    const name1 = formatProductName(gpu1, { company: false, brand: true });
    const name2 = formatProductName(gpu2, { company: false, brand: true });

    const clockBase1 = productFieldFormattedValue(
      gpu1.fields?.gpuCoreBaseClock,
    );
    const clockBoost1 = productFieldFormattedValue(
      gpu1.fields?.gpuCoreBoostClock,
    );
    const clock1 =
      [clockBase1, clockBoost1].filter((value) => value != null).join(' / ') ||
      '--';

    const clockBase2 = productFieldFormattedValue(
      gpu2.fields?.gpuCoreBaseClock,
    );
    const clockBoost2 = productFieldFormattedValue(
      gpu2.fields?.gpuCoreBoostClock,
    );
    const clock2 =
      [clockBase2, clockBoost2].filter((value) => value != null).join(' / ') ||
      '--';

    let bold1 = false;
    let bold2 = false;
    if (
      productFieldRawValue(gpu1.fields?.gpuCoreBaseClock) ===
      productFieldRawValue(gpu2.fields?.gpuCoreBaseClock)
    ) {
      bold1 =
        productFieldRawValue(gpu1.fields?.gpuCoreBoostClock) >
        productFieldRawValue(gpu2.fields?.gpuCoreBoostClock);
      bold2 =
        productFieldRawValue(gpu1.fields?.gpuCoreBoostClock) <
        productFieldRawValue(gpu2.fields?.gpuCoreBoostClock);
    } else {
      bold1 =
        productFieldRawValue(gpu1.fields?.gpuCoreBaseClock) >
        productFieldRawValue(gpu2.fields?.gpuCoreBaseClock);
      bold2 =
        productFieldRawValue(gpu1.fields?.gpuCoreBaseClock) <
        productFieldRawValue(gpu2.fields?.gpuCoreBaseClock);
    }

    return [
      { name: name1, value: clock1, bold: bold1 },
      { name: name2, value: clock2, bold: bold2 },
    ];
  }, [gpu1, gpu2]);

  return (
    <ProductHighlightComparison
      icon={<ClockIcon />}
      label="Clock"
      values={values}
      className={className}
    ></ProductHighlightComparison>
  );
};
