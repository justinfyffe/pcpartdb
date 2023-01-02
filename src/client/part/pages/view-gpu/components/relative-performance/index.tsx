import React, { FunctionComponent } from 'react';
import { PerformanceIntro } from './intro';
import { PerformanceTable } from './table';

export const RelativePerformance: FunctionComponent = () => {
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
