'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const CacheIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      CPU cache specs like its L1 &amp; L2 cache. These provide the CPU with a
      small, but super-fast memory access. A larger cache can improve a
      CPU&apos;s performance.
    </p>
  ),
});

export const CacheIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <CacheIntroParagraph />
    </ContentProvider>
  );
};
