'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CoresIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Processing power information like its cores and clock speed. These specs
      impact how fast they can handle instructions and tasks. These have a
      strong impact on the CPU&apos;s performance.
    </p>
  ),
});

export const CoresIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CoresIntroParagraph />
    </ContentProvider>
  );
};
