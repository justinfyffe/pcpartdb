import { hasProductFieldValue } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';
import { BenchmarksIntro } from './BenchmarksIntro';
import { BenchmarksTable } from './BenchmarksTable';

export const Benchmarks: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  if (
    !hasProductFieldValue(gpu.g3dMark) &&
    !hasProductFieldValue(gpu.g2dMark) &&
    !hasProductFieldValue(gpu.timespyGraphics)
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
