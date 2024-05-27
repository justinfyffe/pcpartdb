'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const PowerIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Compatibility and power consumption information like its socket type,
      thermal design power, power limits. These can help verify the CPU&apos;s
      compatibility with other PC components.
    </p>
  ),
});

export const PowerIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <PowerIntroParagraph />
    </ContentProvider>
  );
};
