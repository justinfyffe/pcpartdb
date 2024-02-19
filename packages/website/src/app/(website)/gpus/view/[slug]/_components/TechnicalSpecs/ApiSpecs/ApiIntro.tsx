'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const ApiIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      API versions that the {props.nameWithNoCompany} supports. Older GPUs may
      not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
