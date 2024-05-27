'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const FeatureIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Additional CPU features like its bundled cooler, integrated graphics, and
      extensions/technologies.
    </p>
  ),
});

export const FeatureIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <FeatureIntroParagraph />
    </ContentProvider>
  );
};
