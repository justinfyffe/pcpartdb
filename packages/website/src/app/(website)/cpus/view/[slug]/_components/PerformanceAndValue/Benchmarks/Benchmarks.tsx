'use client';

import { ViewCpuViewModel } from '@pcpartdb/shared';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const viewModel = useViewModel<ViewCpuViewModel>();
  const cpu = viewModel.cpu;

  if (!cpu.benchmarks?.length) {
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
