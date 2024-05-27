'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      <>
        Performance metrics across industry-standard CPU benchmark tests. These
        scores provide a valuable insight into overall performance. Powerful
        CPUs tend to have higher scores.
      </>
    </p>
  ),
});

export const BenchmarksIntro = () => {
  return (
    <ContentProvider>
      <BenchmarksParagraph />
    </ContentProvider>
  );
};
