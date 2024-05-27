'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CoresIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Processing power information like its cores and clock speed. These specs
      impact how fast they can process graphics. Each type of core or component
      serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p>
        <CoresIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
