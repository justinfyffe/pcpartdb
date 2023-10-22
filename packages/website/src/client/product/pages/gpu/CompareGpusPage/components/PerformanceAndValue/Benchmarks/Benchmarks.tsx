import { BenchmarKey, hasProductBenchmark } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductBenchmark(gpu1, BenchmarKey.G3dMark) &&
    !hasProductBenchmark(gpu2, BenchmarKey.G3dMark) &&
    !hasProductBenchmark(gpu1, BenchmarKey.G2dMark) &&
    !hasProductBenchmark(gpu2, BenchmarKey.G2dMark) &&
    !hasProductBenchmark(gpu1, BenchmarKey.TimespyGraphics) &&
    !hasProductBenchmark(gpu2, BenchmarKey.TimespyGraphics)
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
