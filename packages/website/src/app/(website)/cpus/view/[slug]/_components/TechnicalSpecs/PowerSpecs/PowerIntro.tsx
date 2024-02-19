'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const PowerIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.nameWithNoCompany}&apos;s power consumption specs like its thermal
      design power and power limits.
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
