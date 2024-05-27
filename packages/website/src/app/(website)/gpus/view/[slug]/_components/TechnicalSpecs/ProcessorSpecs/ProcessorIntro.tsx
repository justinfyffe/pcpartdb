'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      General information about the graphics processing unit like its
      architecture, manufacturing process size, and transistor count. Newer GPU
      architectures generally bring efficiency improvements and may introduce
      technologies that enhance graphical capabilities.
    </>
  ),
});

export const ProcessorIntro = () => {
  return (
    <ContentProvider>
      <p>
        <ProcessorIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
