'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React from 'react';

export const PerformanceIntroParagraph = compileContentComponent({
  Component: (props) => (
    <>
      The average score in the{' '}
      <PreferredBenchmarkDialogTrigger
        buttonVariant={ButtonVariant.LinkDialog}
        productType={ProductType.Cpu}
        softReload
        productIds={props.productIds}
      >
        {props.preferredBenchmarkName}
      </PreferredBenchmarkDialogTrigger>{' '}
      benchmark test can be compared to similar CPUs to assess relative
      performance. Generally, powerful CPUs tend to have higher scores.
    </>
  ),
});

export const PerformanceIntro = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });
  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  return (
    <ContentProvider
      params={{
        name1,
        name2,
        preferredBenchmarkName,
        productIds: [cpu1.id, cpu2.id],
      }}
    >
      <p>
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
