'use client';

import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useProductContent } from 'packages/website/src/app/_common/product/content/useProductContent';
import React from 'react';

const GeneralInfoIntro1 = compileContentComponent({
  Component: (props: any) => (
    <>
      General overview of the GPU, including details like its manufacturer,
      release date, launch price, and current production status.
    </>
  ),
});

export function GeneralInfoIntro() {
  return (
    <ContentProvider>
      <p>
        <GeneralInfoIntro1 />
      </p>
    </ContentProvider>
  );
}
