import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const { gpu } = useContext(ViewPageContext);

  const performanceScore =
    gpu.chipset?.performanceScore?.value || gpu.performanceScore?.value;
  if (performanceScore == null) {
    return <></>;
  }

  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Performance</h2>
      <PerformanceIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <PerformanceTable />
      </section>
    </section>
  );
};
