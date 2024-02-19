'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const PerformanceIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s performance with similar{' '}
      {props.marketSegment} CPUs. This provides insight into how its benchmark
      compares to its peers. This data is based on its{' '}
      {props.preferredBenchmarkName} performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
