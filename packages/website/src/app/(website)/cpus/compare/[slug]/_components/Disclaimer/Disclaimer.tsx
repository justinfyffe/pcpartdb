'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import { usePreferredBenchmarkDialog } from 'packages/website/src/app/_common/user/usePreferredBenchmarkDialog';
import React, { useMemo } from 'react';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  deps: [],
  component: (props) => (
    <>
      *The {props.name1} and {props.name2}&apos;s performance score, performance
      per dollar, and rankings are based on the {props.preferredBenchmarkName}{' '}
      benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Cpu,
    hardReload: true,
  });

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
      <p className="text-dimmed">
        <RatingDisclaimer />{' '}
        <Button
          variant={ButtonVariant.Link}
          onClick={showPreferredBenchmarkDialog}
        >
          Click here to change your preferred benchmark.
        </Button>
      </p>
    </ContentProvider>
  );
};
