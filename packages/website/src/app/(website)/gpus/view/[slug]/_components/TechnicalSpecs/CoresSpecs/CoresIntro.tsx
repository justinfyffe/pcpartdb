'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CoresIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.nameWithNoCompany}&apos;s cores, clock speed, and cache. These
      specs have an impact on how fast the {props.nameWithNoCompanyNoBrand} can
      process graphics. Each type of core serves a specific computational
      purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
