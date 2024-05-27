'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const ProcessorIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      General information about the graphics processing unit like their
      architecture, manufacturing process size, and transistor count. Newer GPU
      architectures generally bring efficiency improvements and may introduce
      technologies that enhance graphical capabilities.
    </>
  ),
});

export const ProcessorIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p>
        <ProcessorIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
