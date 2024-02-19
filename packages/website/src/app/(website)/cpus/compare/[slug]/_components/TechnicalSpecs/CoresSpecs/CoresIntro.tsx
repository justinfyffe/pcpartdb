'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const CoresIntroParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      {props.name1} and {props.name2}&apos;s core and clock speed specs like its
      core count, thread count, clock frequency, and turbo clock.
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
