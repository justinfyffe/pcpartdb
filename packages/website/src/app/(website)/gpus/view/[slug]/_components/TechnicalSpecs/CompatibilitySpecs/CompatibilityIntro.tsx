'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Compatibility information like its slot size, bus interface, power
      consumption, and display support. These specs are useful for verifying
      compatibility with your motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p>
        <CompatibilityIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
