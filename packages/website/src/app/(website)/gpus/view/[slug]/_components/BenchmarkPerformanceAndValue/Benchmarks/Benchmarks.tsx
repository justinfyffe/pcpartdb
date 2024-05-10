'use client';

import { ViewGpuViewModel } from '@pcpartdb/shared';
import { useViewModel } from 'packages/website/src/app/_common/contexts/ViewModelProvider';
import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarkTables';

export const Benchmarks: FunctionComponent = () => {
  const viewModel = useViewModel<ViewGpuViewModel>();
  const gpu = viewModel.gpu;

  if (!gpu.benchmarks?.length) {
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
