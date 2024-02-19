'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import React from 'react';

export const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      per dollar with similar GPUs. This provides insight into which GPUs give
      the better bang for your buck. This data is based on{' '}
      {props.preferredBenchmarkName} benchmark performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = formatProductName(chipset1, { company: false });
  const chipsetName2 = formatProductName(chipset2, { company: false });

  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  return (
    <ContentProvider
      params={{ chipsetName1, chipsetName2, preferredBenchmarkName }}
    >
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
