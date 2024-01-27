import React, { FunctionComponent } from 'react';
import { Benchmarks } from './Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance';
import { RelativeValue } from './RelativeValue';

export const PerformanceAndValue: FunctionComponent = () => {
  return (
    <section className="flex flex-col">
      <h2 className="font-semibold">Performance &amp; Value</h2>

      <div className="flex flex-col gap-6">
        <PerformanceAndValueCharts />
        <div className="flex gap-6 md:flex-col md:gap-6">
          <RelativePerformance />
          <RelativeValue />
        </div>
        <Benchmarks />
      </div>
    </section>
  );
};
