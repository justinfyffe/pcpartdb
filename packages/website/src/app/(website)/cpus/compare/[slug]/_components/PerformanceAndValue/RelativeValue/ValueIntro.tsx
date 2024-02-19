'use client';

import {
  CompareCpusViewModel,
  formatProductName,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentProvider } from 'packages/website/src/app/_common/content/ContentProvider';
import { compileContentComponent } from 'packages/website/src/app/_common/content/utils/compileContentComponent';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import { usePreferredBenchmark } from 'packages/website/src/app/_common/user/usePreferredBenchmark';
import React from 'react';

const ValueIntroParagraph = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.name1} and {props.name2}&apos;s performance per dollar with
      similar CPUs. This provides insight into which CPUs gives the best bang
      for your buck. This data is based on {props.preferredBenchmarkName}{' '}
      benchmark performance and MSRP.
    </>
  ),
});

export const ValueIntro = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });
  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  return (
    <ContentProvider params={{ name1, name2, preferredBenchmarkName }}>
      <p className="text-dimmed">
        <ValueIntroParagraph />
      </p>
    </ContentProvider>
  );
};
