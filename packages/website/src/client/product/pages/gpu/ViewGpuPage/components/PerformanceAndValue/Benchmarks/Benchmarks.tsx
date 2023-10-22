import { BenchmarKey, hasProductBenchmark } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductBenchmark(gpu, BenchmarKey.G3dMark) &&
    !hasProductBenchmark(gpu, BenchmarKey.G2dMark) &&
    !hasProductBenchmark(gpu, BenchmarKey.TimespyGraphics)
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
