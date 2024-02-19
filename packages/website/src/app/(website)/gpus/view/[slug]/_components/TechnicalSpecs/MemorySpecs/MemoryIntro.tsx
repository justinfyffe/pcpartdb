'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the{' '}
      {props.nameWithNoCompany}. GPU memory stores graphics data like frames,
      textures, and shadows which helps display rendered images. These specs are
      critical for graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { contentTags, contentParams } = useProductContent();

  return (
    <ContentProvider tags={contentTags} params={contentParams}>
      <p className="text-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
