'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
} from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';

const GameFpsIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Gaming FPS benchmarks for the {props.chipsetName1} and the{' '}
      {props.chipsetName2}. For gamers, these are usually the best indicator for
      determing a GPUs performance and value. This data is based on its FPS
      performance across different games.
    </>
  ),
});
export const GameFpsIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = formatProductName(chipset1, { company: false });
  const chipsetName2 = formatProductName(chipset2, { company: false });

  return (
    <ContentProvider params={{ chipsetName1, chipsetName2 }}>
      <p className="text-dimmed">
        <GameFpsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
