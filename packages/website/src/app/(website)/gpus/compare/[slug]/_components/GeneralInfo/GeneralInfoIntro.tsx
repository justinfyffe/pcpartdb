'use client';

import { GpuProductComparison } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import React from 'react';

export const GeneralInfoIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      General overview of the GPU, including details like its manufacturer,
      release date, launch price, and current production status.
    </>
  ),
});

interface GeneralInfoIntroProps {
  comparison: GpuProductComparison;
}

export function GeneralInfoIntro(props: GeneralInfoIntroProps) {
  return (
    <ContentProvider>
      <p>
        <GeneralInfoIntroSentence1 />
      </p>
    </ContentProvider>
  );
}
