import { CpuProduct, formatProductName } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';
import { Benchmarks } from './Benchmarks/Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance/RelativePerformance';
import { RelativeValue } from './RelativeValue/RelativeValue';

interface PerformanceAndValueProps {
  cpu: Partial<CpuProduct>;
}

export function PerformanceAndValue(props: PerformanceAndValueProps) {
  const { cpu } = props;

  const cpuName = formatProductName(cpu);
  const hasBenchmarks = cpu?.benchmarks != null && cpu.benchmarks.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="benchmark-performance" menu={<Contents />}>
        Benchmark Performance
      </SectionHeader>

      {hasBenchmarks && (
        <div className="flex flex-col gap-6">
          <PerformanceAndValueCharts />
          <div className="flex gap-6 md:flex-col md:gap-6">
            <RelativePerformance />
            <RelativeValue />
          </div>
          <Benchmarks />
        </div>
      )}

      {!hasBenchmarks && (
        <div className="text-center py-8">
          Our database does not have any benchmark data for the {cpuName}.
        </div>
      )}
    </section>
  );
}
