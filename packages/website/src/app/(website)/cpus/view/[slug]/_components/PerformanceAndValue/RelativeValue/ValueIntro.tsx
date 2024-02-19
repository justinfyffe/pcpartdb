'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const ValueIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      Compare {props.nameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} CPUs. This provides insight into which CPUs gives
      the best bang for your buck. This data is based on{' '}
      {props.preferredBenchmarkName} performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <ValueIntroParagraph />
      </p>
    </ContentProvider>
  );
};
