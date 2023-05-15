import React, { FunctionComponent } from 'react';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">Benchmarks</h2>
      <BenchmarksIntro />
      <BenchmarksTable className="mb-4" />
    </section>
  );
};
