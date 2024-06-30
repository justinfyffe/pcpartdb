'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

export const BenchmarksIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      This table showcases the average performance scores achieved by both GPUs
      across industry-standard benchmark tests. These scores provide a valuable
      insight into overall performance. Powerful GPUs tend to have higher
      scores.
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
