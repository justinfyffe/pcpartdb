import React, { FunctionComponent } from 'react';
import { ValueArchitectureTable } from './architecture-table';
import { ValueIntro } from './intro';
import { ValueYearTable } from './year-table';

export const RelativeValue: FunctionComponent = () => {
  return (
    <section>
      <h2 className="mb-0 font-semibold">Relative Value</h2>
      <ValueIntro />

      <section className="flex flex-wrap gap-8 mb-4">
        <div className="flex-1">
          <ValueYearTable />
        </div>

        <div className="flex-1">
          <ValueArchitectureTable />
        </div>
      </section>
    </section>
  );
};
