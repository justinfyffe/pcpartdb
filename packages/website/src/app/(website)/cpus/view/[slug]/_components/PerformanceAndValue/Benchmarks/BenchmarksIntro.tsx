'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      This table showcases the {props.nameWithNoCompany}&apos;s average
      performance scores across industry-standard CPU benchmark tests. These
      scores provide a valuable insight into overall performance. Powerful CPUs
      tend to have higher scores.
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
