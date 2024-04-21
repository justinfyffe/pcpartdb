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
import { usePreferredBenchmark } from 'packages/website/src/app/_common/product/hooks/usePreferredBenchmark';
import React from 'react';

export const PerformanceIntroParagraph = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.name1} and {props.name2}&apos;s performance with similar
      CPUs. This provides insight into how their benchmarks compare to their
      peers. This data is based on {props.preferredBenchmarkName} performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  const name1 = formatProductName(cpu1, { company: false });
  const name2 = formatProductName(cpu2, { company: false });
  const preferredBenchmarkName =
    getProductBenchmarkShortName(preferredBenchmark);

  return (
    <ContentProvider params={{ name1, name2, preferredBenchmarkName }}>
      <p className="text-dimmed">
        <PerformanceIntroParagraph />
      </p>
    </ContentProvider>
  );
};
