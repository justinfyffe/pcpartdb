'use client';

import { getProductBenchmarkName, ProductType } from '@pcpartdb/shared';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmarkDialog';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface ListFilterPreferredBenchmarkProps {
  className?: string;
}

export const ListFilterPreferredBenchmark: FunctionComponent<
  ListFilterPreferredBenchmarkProps
> = (props) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    hardReload: true,
  });

  return (
    <div className={classNames('flex flex-col', props.className)}>
      <div className="font-bold m-2">Performance Benchmark:</div>
      <button
        onClick={showPreferredBenchmarkDialog}
        className={classNames(
          'cursor-pointer p-2 hover:bg-mouse-hover text-link text-left whitespace-nowrap underline decoration-dotted decoration-1',
        )}
      >
        {getProductBenchmarkName(preferredBenchmark)}
      </button>
    </div>
  );
};
