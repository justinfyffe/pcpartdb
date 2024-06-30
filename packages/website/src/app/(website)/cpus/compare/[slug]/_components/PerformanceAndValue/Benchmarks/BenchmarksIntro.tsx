'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      <>
        This table showcases the average performance scores achieved by both
        CPUs across industry-standard benchmark tests. These scores provide a
        valuable insight into overall performance. Powerful CPUs tend to have
        higher scores.
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
