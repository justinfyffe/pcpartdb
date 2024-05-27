'use client';

import { CompareGpusViewModel } from '@pcpartdb/shared';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useViewModel<CompareGpusViewModel>();
  const [gpu1, gpu2] = comparison;

  if (!gpu1.benchmarks?.length && !gpu2.benchmarks?.length) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-1 font-semibold">Benchmark Scores</h3>
      <BenchmarksIntro />
      <BenchmarkTables credit />
    </section>
  );
};
