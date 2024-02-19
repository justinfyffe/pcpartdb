'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const BenchmarksIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Performance and benchmark metrics for the {props.chipsetNameWithNoCompany}
      . These are usually the best indicator for determing a GPUs performance.
      This data is based on its chipset.
    </>
  ),
});
export const BenchmarksIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <BenchmarksIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
