import { BenchmarKey, hasProductBenchmark } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductBenchmark(cpu, BenchmarKey.CpuMarkMultiThread) &&
    !hasProductBenchmark(cpu, BenchmarKey.CpuMarkSingleThread) &&
    !hasProductBenchmark(cpu, BenchmarKey.GeekBenchMultiCore) &&
    !hasProductBenchmark(cpu, BenchmarKey.GeekBenchSingleCore)
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Benchmarks</h3>
      <BenchmarksIntro />
      <BenchmarksTable className="mb-4" />
    </section>
  );
};
