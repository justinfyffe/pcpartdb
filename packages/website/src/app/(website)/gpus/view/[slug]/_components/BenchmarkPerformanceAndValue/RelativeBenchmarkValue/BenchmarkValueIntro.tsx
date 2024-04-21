'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const ValueIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetNameWithNoCompany}&apos;s value with similar{' '}
      {props.marketSegment} GPUs. This provides insight into which GPU gives the
      best bang for your buck. This data is based on its{' '}
      {props.preferredBenchmarkName} performance and MSRP.
    </>
  ),
});

export const BenchmarkValueIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <ValueIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
