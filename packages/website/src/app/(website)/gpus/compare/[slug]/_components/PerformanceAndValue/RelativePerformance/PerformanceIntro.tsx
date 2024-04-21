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
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React from 'react';

export const PerformanceIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      with similar GPUs. This provides insight into how their benchmarks compare
      to their peers. This data is based on {props.preferredBenchmarkName}{' '}
      performance.
    </>
  ),
});

export const PerformanceIntro = () => {
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
        <PerformanceIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
