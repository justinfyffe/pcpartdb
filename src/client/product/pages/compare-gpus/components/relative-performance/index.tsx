import React, { FunctionComponent } from 'react';
import { PerformanceIntro } from './intro';
import { PerformanceTable } from './table';

export const RelativePerformance: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Performance</h2>
      <PerformanceIntro />
      <PerformanceTable className="mb-4" />
    </section>
  );
};
