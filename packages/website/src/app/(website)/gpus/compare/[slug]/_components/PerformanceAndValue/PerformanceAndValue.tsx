import { formatProductName, GpuProductComparison } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Benchmarks } from './Benchmarks/Benchmarks';
import { PerformanceAndValueCharts } from './PerformanceAndValueCharts';
import { RelativePerformance } from './RelativePerformance/RelativePerformance';
import { RelativeValue } from './RelativeValue/RelativeValue';

interface PerformanceAndValueProps {
  comparison: GpuProductComparison;
}

export function PerformanceAndValue(props: PerformanceAndValueProps) {
  const { comparison } = props;
  const [gpu1, gpu2] = comparison;

  const gpuName1 = formatProductName(gpu1);
  const gpuName2 = formatProductName(gpu2);
  const hasBenchmarks1 = gpu1?.benchmarks != null && gpu1.benchmarks.length > 0;
  const hasBenchmarks2 = gpu2?.benchmarks != null && gpu2.benchmarks.length > 0;

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
          Our database does not have any benchmark data for the {gpuName1} and
          the {gpuName2}.
        </div>
      )}
    </section>
  );
}
