'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const RetailModelsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      The following cards are retail models based on the{' '}
      {props.chipsetNameWithNoCompany} chipset. Retail models may have different
      performance and specs.
    </>
  ),
});
export const RetailModelsIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="mb-0">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
