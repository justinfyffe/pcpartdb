'use client';

import { CompareCpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

const BenchmarksParagraph = compileContentComponent({
  deps: [],
  component: (props) => (
    <p className="text-dimmed">
      Performance and benchmark metrics for the {props.name1} and {props.name2}.
      These are usually the best indicator for determing a CPUs performance.
    </p>
  ),
});

export const BenchmarksIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <BenchmarksParagraph />
    </ContentProvider>
  );
};
