'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>General information about {props.nameWithNoCompany}&apos;s processor.</>
  ),
});

export const ProcessorIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <ProcessorIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
