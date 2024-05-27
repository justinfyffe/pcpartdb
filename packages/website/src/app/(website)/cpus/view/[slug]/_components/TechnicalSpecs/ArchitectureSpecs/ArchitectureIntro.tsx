'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const ArchitectureIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      CPU architecture specs like its memory channels, memory support, and
      microarchitecture. Newer CPU architectures can minimize bottlenecks and
      improve execution efficiency using more advanced techniques.
    </p>
  ),
});

export const ArchitectureIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <ArchitectureIntroParagraph />
    </ContentProvider>
  );
};
