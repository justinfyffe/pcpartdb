'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Performance and benchmark metrics for the {props.nameWithNoCompany}. These
      are usually the best indicator for determing a CPUs performance.
    </p>
  ),
});

export const BenchmarksIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <BenchmarksParagraph />
    </ContentProvider>
  );
};
