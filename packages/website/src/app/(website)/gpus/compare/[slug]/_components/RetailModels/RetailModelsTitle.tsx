'use client';

import {
  CompareGpusViewModel,
  formatProductName,
  getGpuChipset,
} from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React from 'react';
import { Contents } from '../Contents/Contents';

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
      <SectionHeader linkId="retail-models" menu={<Contents />}>
        <Title />
      </SectionHeader>
    </ContentProvider>
  );
};
