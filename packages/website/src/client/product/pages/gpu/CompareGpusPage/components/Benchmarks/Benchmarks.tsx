import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    !hasProductFieldValue(gpu1.g3dMark) &&
    !hasProductFieldValue(gpu2.g3dMark) &&
    !hasProductFieldValue(gpu1.g2dMark) &&
    !hasProductFieldValue(gpu2.g2dMark) &&
    !hasProductFieldValue(gpu1.timespyGraphics) &&
    !hasProductFieldValue(gpu2.timespyGraphics)
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
