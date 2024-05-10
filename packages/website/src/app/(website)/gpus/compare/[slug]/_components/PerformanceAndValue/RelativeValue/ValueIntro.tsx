'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React from 'react';

export const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.gpuName1} and {props.gpuName2}&apos;s performance per
      dollar with similar GPUs. This provides insight into which GPUs give the
      better bang for your buck. This data is based on{' '}
      {props.preferredBenchmarkName} benchmark performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  return (
    <ContentProvider params={{ gpuName1, gpuName2, preferredBenchmarkName }}>
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
