'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const ArchitectureIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      CPU architecture specs like their memory channels, memory support, and
      microarchitecture. Newer CPU architectures can minimize bottlenecks and
      improve execution efficiency using more advanced techniques.
    </p>
  ),
});

export const ArchitectureIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <ArchitectureIntroParagraph />
    </ContentProvider>
  );
};
