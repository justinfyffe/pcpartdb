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

const Title = compileContentComponent({
  tags: [],
  component: (props) => (
    <>
      {props.chipsetName1} and {props.chipsetName2} Graphics Cards
    </>
  ),
});

export const RetailModelsTitle = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = formatProductName(chipset1, { company: false });
  const chipsetName2 = formatProductName(chipset2, { company: false });

  return (
    <ContentProvider params={{ chipsetName1, chipsetName2 }}>
      <h2 className="mb-1 font-semibold">
        <Title />
      </h2>
    </ContentProvider>
  );
};
