import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (!cpu.benchmarks?.length) {
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
