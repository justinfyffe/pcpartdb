'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
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
import React from 'react';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  component: (props) => (
    <>
      *The {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      score, performance per dollar, and rankings are based on the{' '}
      {props.preferredBenchmarkName} benchmark and MSRP.
    </>
  ),
});

export const Disclaimer = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const showPreferredBenchmarkDialog = usePreferredBenchmarkDialog({
    productType: ProductType.Gpu,
    hardReload: true,
  });

  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = formatProductName(chipset1);
  const chipsetName2 = formatProductName(chipset2);
  const preferredBenchmarkName = getProductBenchmarkName(preferredBenchmark);

  return (
    <ContentProvider
      params={{
        chipsetName1,
        chipsetName2,
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
