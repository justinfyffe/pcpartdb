import React, { FunctionComponent } from 'react';
import { Benchmarks } from './Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance';
import { RelativeValue } from './RelativeValue';

export const PerformanceAndValue: FunctionComponent = () => {
  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Performance &amp; Value</h2>

      <div className="flex flex-col gap-8">
        <PerformanceAndValueCharts />
        <div className="flex gap-4 md:flex-col md:gap-8">
          <RelativePerformance />
          <RelativeValue />
        </div>
        <Benchmarks />
      </div>
    </section>
  );
};
