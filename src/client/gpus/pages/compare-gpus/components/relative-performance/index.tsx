import React, { FunctionComponent, useContext } from 'react';
import { ComparePageContext } from '../../context';
import { PerformanceIntro } from './intro';
import { PerformanceTable } from './table';

export const RelativePerformance: FunctionComponent = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  if (
    gpu1.benchmarks?.performanceScore?.value == null &&
    gpu2.benchmarks?.performanceScore?.value == null
  ) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Performance</h2>
      <PerformanceIntro />
      <PerformanceTable className="mb-4" />
    </section>
  );
};
