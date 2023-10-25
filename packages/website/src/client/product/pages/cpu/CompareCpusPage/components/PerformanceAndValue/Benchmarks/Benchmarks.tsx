import { BenchmarKey, hasProductBenchmark } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductBenchmark(cpu1, BenchmarKey.CpuMarkMultiThread) &&
    !hasProductBenchmark(cpu2, BenchmarKey.CpuMarkMultiThread) &&
    !hasProductBenchmark(cpu1, BenchmarKey.CpuMarkSingleThread) &&
    !hasProductBenchmark(cpu2, BenchmarKey.CpuMarkSingleThread) &&
    !hasProductBenchmark(cpu1, BenchmarKey.GeekBenchMultiCore) &&
    !hasProductBenchmark(cpu2, BenchmarKey.GeekBenchMultiCore) &&
    !hasProductBenchmark(cpu1, BenchmarKey.GeekBenchSingleCore) &&
    !hasProductBenchmark(cpu2, BenchmarKey.GeekBenchSingleCore)
  ) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-0 font-semibold">Benchmarks</h3>
      <BenchmarksIntro />
      <BenchmarksTable />
    </section>
  );
};
