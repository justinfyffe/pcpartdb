'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const RetailModelsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>Retail models based on the {props.chipsetNameWithNoCompany} chipset.</>
  ),
});
export const RetailModelsIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
