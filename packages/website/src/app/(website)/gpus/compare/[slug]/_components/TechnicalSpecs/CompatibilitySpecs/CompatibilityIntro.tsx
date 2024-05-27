'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const CompatibilityIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Compatibility information like their slot size, bus interface, power
      consumption, and display support. These specs are useful for verifying
      compatibility with your motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p>
        <CompatibilityIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
