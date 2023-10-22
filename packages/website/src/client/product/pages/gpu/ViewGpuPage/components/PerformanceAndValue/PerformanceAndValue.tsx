import React, { FunctionComponent } from 'react';
import { Benchmarks } from './Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance';
import { RelativeValue } from './RelativeValue';

export const PerformanceAndValue: FunctionComponent = () => {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="mb-0 font-semibold">Performance &amp; Value</h2>

      <PerformanceAndValueCharts />
      <RelativePerformance />
      <RelativeValue />
      <Benchmarks />
    </section>
  );
};
