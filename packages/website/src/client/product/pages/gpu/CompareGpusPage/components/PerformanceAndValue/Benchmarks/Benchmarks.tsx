import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (!gpu1.benchmarks?.length && !gpu2.benchmarks?.length) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-1 font-semibold">Benchmarks</h3>
      <BenchmarksIntro />
      <BenchmarkTables />
    </section>
  );
};
