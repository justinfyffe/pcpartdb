'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const GeneralInfoParagraph = compileContentComponent({
  Component: (props) => (
    <p>
      General overview of the CPU, including details like its manufacturer,
      release date, launch price, and current production status.
    </p>
  ),
});

export const GeneralInfoIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <GeneralInfoParagraph />
    </ContentProvider>
  );
};
