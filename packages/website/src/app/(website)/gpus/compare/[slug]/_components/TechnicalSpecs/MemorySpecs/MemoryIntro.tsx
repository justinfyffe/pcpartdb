'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

export const MemoryIntroSentence1 = compileContentComponent({
  deps: [],
  Component: (props) => (
    <>
      Memory specifications like their capacity, bandwidth, and clock speeds.
      GPU memory stores graphics data like frames, textures, and shadows which
      helps display rendered images. These specs are crucial for
      graphics-intense applications like gaming and 3D modeling.
    </>
  ),
});

export const MemoryIntro = () => {
  return (
    <ContentProvider>
      <p>
        <MemoryIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
