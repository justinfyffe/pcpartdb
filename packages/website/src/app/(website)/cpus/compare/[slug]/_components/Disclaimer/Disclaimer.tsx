'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { PreferredBenchmarkDialogTrigger } from 'packages/website/src/app/_common/product/components/PreferredBenchmarkDialog/PreferredBenchmarkDialog';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React, { useCallback, useMemo } from 'react';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: [],
  Component: (props) => (
    <>
      * Performance rating, performance per dollar, and rankings are based on
      the {props.preferredBenchmarkName} benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);

  const handleBenchmarkChange = useCallback(async () => {
    window.scrollTo(0, 0);
  }, []);

  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = useMemo(() => formatProductName(cpu1), [cpu1]);
  const name2 = useMemo(() => formatProductName(cpu2), [cpu2]);
  const preferredBenchmarkName = getProductBenchmarkName(preferredBenchmark);

  return (
    <ContentProvider
      params={{
        name1,
        name2,
        preferredBenchmarkName,
      }}
    >
      <p>
        <RatingDisclaimer />{' '}
        <PreferredBenchmarkDialogTrigger
          buttonVariant={ButtonVariant.LinkDialog}
          productType={ProductType.Cpu}
          softReload
          productIds={[cpu1.id, cpu2.id]}
          onChange={handleBenchmarkChange}
          className="text-left"
        >
          Click here to change your preferred benchmark.
        </PreferredBenchmarkDialogTrigger>
      </p>
    </ContentProvider>
  );
};
