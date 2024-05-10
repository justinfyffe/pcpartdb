'use client';

import { CompareGpusViewModel, formatProductName } from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

const GameFpsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Gaming FPS benchmarks for the {props.gpuName1} and the {props.gpuName2}.
      For gamers, these are usually the best indicator for determing a GPUs
      performance and value. This data is based on its FPS performance across
      different games.
    </>
  ),
});
export const GameFpsIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1, { company: false });
  const gpuName2 = formatProductName(gpu2, { company: false });

  return (
    <ContentProvider params={{ gpuName1, gpuName2 }}>
      <p className="text-dimmed">
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
