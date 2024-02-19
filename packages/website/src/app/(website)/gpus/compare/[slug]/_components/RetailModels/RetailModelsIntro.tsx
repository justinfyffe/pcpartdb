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

const RetailModelsIntroSentence1 = compileContentComponent({
  tags: [],
  deps: ['chipsetShortName1', 'chipsetShortName2'],
  component: (props) => (
    <>
      Retail models based on the {props.chipsetName1} and {props.chipsetName2}{' '}
      chipsets.
    </>
  ),
});
export const RetailModelsIntro = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = formatProductName(chipset1, { company: false });
  const chipsetName2 = formatProductName(chipset2, { company: false });

  return (
    <ContentProvider params={{ chipsetName1, chipsetName2 }}>
      <p className="text-dimmed">
        <RetailModelsIntroSentence1 />
      </p>
    </ContentProvider>
  );
};
