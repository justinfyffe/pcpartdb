'use client';

import { CompareCpusViewModel } from '@pcpartdb/shared';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useViewModel<CompareCpusViewModel>();
  const [cpu1, cpu2] = comparison;

  if (!cpu1.benchmarks?.length && !cpu2.benchmarks?.length) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-1 font-semibold">Benchmarks</h3>
      <BenchmarksIntro />
      <BenchmarkTables credit />
    </section>
  );
};
