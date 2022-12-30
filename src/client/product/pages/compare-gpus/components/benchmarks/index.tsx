import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './intro';
import { BenchmarksTable } from './table';

export const Benchmarks: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0">Benchmarks</h2>
      <BenchmarksIntro />
      <BenchmarksTable className="mb-4" />
    </section>
  );
};
