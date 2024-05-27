import { CpuProductComparison, formatProductName } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Benchmarks } from './Benchmarks/Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance/RelativePerformance';
import { RelativeValue } from './RelativeValue/RelativeValue';

interface PerformanceAndValueProps {
  comparison: CpuProductComparison;
}

export function PerformanceAndValue(props: PerformanceAndValueProps) {
  const { comparison } = props;
  const [cpu1, cpu2] = comparison;

  const cpuName1 = formatProductName(cpu1);
  const cpuName2 = formatProductName(cpu2);
  const hasBenchmarks1 = cpu1?.benchmarks != null && cpu1.benchmarks.length > 0;
  const hasBenchmarks2 = cpu2?.benchmarks != null && cpu2.benchmarks.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="benchmark-performance">
        Benchmark Performance
      </SectionHeader>

      {(hasBenchmarks1 || hasBenchmarks2) && (
        <div className="flex flex-col gap-6">
          <PerformanceAndValueCharts comparison={comparison} />
          <div className="flex gap-6 md:flex-col md:gap-6">
            <RelativePerformance />
            <RelativeValue />
          </div>
          <Benchmarks />
        </div>
      )}

      {!hasBenchmarks1 && !hasBenchmarks2 && (
        <div className="text-center py-8">
          Our database does not have any benchmark data for the {cpuName1} and
          the {cpuName2}.
        </div>
      )}
    </section>
  );
}
