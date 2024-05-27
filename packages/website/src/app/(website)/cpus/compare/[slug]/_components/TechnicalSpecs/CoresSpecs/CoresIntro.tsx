'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const CoresIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Processing power information like their cores and clock speed. These specs
      impact how fast they can handle instructions and tasks. These have a
      strong impact on the CPU&apos;s performance.
    </p>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <CoresIntroParagraph />
    </ContentProvider>
  );
};
