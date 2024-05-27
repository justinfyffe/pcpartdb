'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Performance metrics across industry-standard GPU benchmark tests. These
      scores provide a valuable insight into overall performance. Powerful GPUs
      tend to have higher scores.
    </>
  ),
});

export const BenchmarksIntro = () => {
  return (
    <ContentProvider>
      <p>
        <BenchmarksIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
