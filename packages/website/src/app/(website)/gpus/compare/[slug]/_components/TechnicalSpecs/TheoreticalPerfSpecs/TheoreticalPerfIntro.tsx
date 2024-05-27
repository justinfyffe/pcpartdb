'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const TheoreticalPerfIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Theoretical performance numbers derived from the raw specifications of the
      different components like core count and clock speeds. While these provide
      a glimpse into peak processing power, they do not represent real-world
      performance.
    </>
  ),
});

export const TheoreticalPerfIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p>
        <TheoreticalPerfIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
