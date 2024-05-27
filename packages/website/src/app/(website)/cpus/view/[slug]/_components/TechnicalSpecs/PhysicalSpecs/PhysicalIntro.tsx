'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const PhysicalIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Information about its manufacturing like its foundry, process size, and
      transistor count.
    </p>
  ),
});

export const PhysicalIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <PhysicalIntroParagraph />
    </ContentProvider>
  );
};
