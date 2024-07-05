'use client';

import { getProductBenchmarkName, ProductType } from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent } from 'react';

interface ListFilterPreferredBenchmarkProps {
  className?: string;
}

export const ListFilterPreferredBenchmark: FunctionComponent<
  ListFilterPreferredBenchmarkProps
> = (props) => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  return (
    <div className={classNames('flex flex-col', props.className)}>
      <div className="font-bold m-2">Performance Benchmark:</div>
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={ProductType.Cpu}
        hardReload
        className="p-2 hover:bg-mouse-hover text-link text-left whitespace-nowrap"
      >
        {getProductBenchmarkName(preferredBenchmark)}
      </PreferredBenchmarkDialogTrigger>
    </div>
  );
};
