'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CacheIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      CPU cache specs like its L1 &amp; L2 cache. These provide the CPU with a
      small, but super-fast memory access. A larger cache can improve a
      CPU&apos;s performance.
    </p>
  ),
});

export const CacheIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <CacheIntroParagraph />
    </ContentProvider>
  );
};
