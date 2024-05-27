'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const BenchmarksIntroSentence1 = compileContentComponent({
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
