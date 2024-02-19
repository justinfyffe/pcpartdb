'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: [],
  component: (props) => (
    <>
      The memory size, bandwidth, and clock speeds for the {props.name1} and{' '}
      {props.name2}. GPU memory stores graphics data like frames, textures, and
      shadows which helps display rendered images. These specs are critical for
      graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const name1 = formatProductName(gpu1, { company: false });
  const name2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ name1, name2 }}>
      <p className="text-dimmed">
        <MemoryIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
