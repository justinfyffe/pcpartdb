import React, { FunctionComponent } from 'react';
import { PerformanceArchitectureTable } from './architecture-table';
import { PerformanceIntro } from './intro';
import { PerformanceYearTable } from './year-table';

export const RelativePerformance: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Performance</h2>
      <PerformanceIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <div className="flex-1">
          <PerformanceYearTable />
        </div>

        <div className="flex-1">
          <PerformanceArchitectureTable />
        </div>
      </section>
    </section>
  );
};
