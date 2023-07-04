import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { cpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(cpu.cpuMarkMultiThread) &&
    !hasProductFieldValue(cpu.cpuMarkSingleThread) &&
    !hasProductFieldValue(cpu.geekbenchMultiCore) &&
    !hasProductFieldValue(cpu.geekbenchSingleCore)
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
