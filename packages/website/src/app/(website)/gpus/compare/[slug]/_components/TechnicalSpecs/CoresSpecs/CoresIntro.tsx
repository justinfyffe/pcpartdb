'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const CoresIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      {props.name1} and {props.name2}&apos;s cores, clock speed, and cache.
      These specs have an impact on how fast they can process graphics. Each
      type of core serves a specific computational purpose.
    </>
  ),
});

export const CoresIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p className="text-dimmed">
        <CoresIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
