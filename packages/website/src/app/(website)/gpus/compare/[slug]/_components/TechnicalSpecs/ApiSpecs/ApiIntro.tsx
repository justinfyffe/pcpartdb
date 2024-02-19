'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const ApiIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      API versions that the {props.name1} and {props.name2} supports. Older GPUs
      may not support recent versions.
    </>
  ),
});

export const ApiIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p className="text-dimmed">
        <ApiIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
