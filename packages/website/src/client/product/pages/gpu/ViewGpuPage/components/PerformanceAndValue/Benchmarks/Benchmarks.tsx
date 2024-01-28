import { getGpuChipset } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarkTables } from './BenchmarkTables';

export const Benchmarks: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);
  const chipset = getGpuChipset(gpu);

  if (!chipset.benchmarks?.length) {
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
