'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const PowerIntroParagraph = compileContentComponent({
  deps: [],
  Component: (props) => (
    <p>
      Compatibility and power consumption information like its socket type,
      thermal design power, power limits. These can help verify the CPU&apos;s
      compatibility with other PC components.
    </p>
  ),
});

export const PowerIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <PowerIntroParagraph />
    </ContentProvider>
  );
};
