'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.gpuName1} and{' '}
      {props.gpuName2}. These are usually the best indicator for determing a
      GPUs performance.
    </>
  ),
});

export const BenchmarksIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ gpuName1, gpuName2 }}>
      <p className="text-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
