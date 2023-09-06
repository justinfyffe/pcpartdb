import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  if (
    !hasProductFieldValue(cpu1.cpuMarkMultiThread) &&
    !hasProductFieldValue(cpu2.cpuMarkMultiThread) &&
    !hasProductFieldValue(cpu1.cpuMarkSingleThread) &&
    !hasProductFieldValue(cpu2.cpuMarkSingleThread) &&
    !hasProductFieldValue(cpu1.geekbenchMultiCore) &&
    !hasProductFieldValue(cpu2.geekbenchMultiCore) &&
    !hasProductFieldValue(cpu1.geekbenchSingleCore) &&
    !hasProductFieldValue(cpu2.geekbenchSingleCore)
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Benchmarks</h2>
      <BenchmarksIntro />
      <BenchmarksTable className="mb-4" />
    </section>
  );
};
