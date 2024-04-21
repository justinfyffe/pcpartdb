import { formatProductName, getGpuChipset, GpuProduct } from '@pcpartdb/shared';
import { SectionHeader } from 'packages/website/src/app/_common/components/SectionHeader/SectionHeader';
import React from 'react';
import { Contents } from '../Contents/Contents';
import { BenchmarkPerformanceAndValueCharts } from './BenchmarkPerformanceAndValueCharts';
import { Benchmarks } from './Benchmarks/Benchmarks';
import { RelativeBenchmarkPerformance } from './RelativeBenchmarkPerformance/RelativeBenchmarkPerformance';
import { RelativeBenchmarkValue } from './RelativeBenchmarkValue/RelativeBenchmarkValue';

interface BenchmarkPerformanceAndValueProps {
  gpu: Partial<GpuProduct>;
}

export function BenchmarkPerformanceAndValue(
  props: BenchmarkPerformanceAndValueProps,
) {
  const { gpu } = props;
  const chipset = getGpuChipset(gpu);

  const gpuName = formatProductName(chipset);
  const hasBenchmarks =
    chipset?.benchmarks != null && chipset.benchmarks.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader linkId="benchmark-performance" menu={<Contents />}>
        Benchmark Performance
      </SectionHeader>

      {hasBenchmarks && (
        <div className="flex flex-col gap-6">
          <BenchmarkPerformanceAndValueCharts />
          <div className="flex gap-6 md:flex-col md:gap-6">
            <RelativeBenchmarkPerformance />
            <RelativeBenchmarkValue />
          </div>
          <Benchmarks />
        </div>
      )}

      {!hasBenchmarks && (
        <div className="text-center py-8">
          Our database does not have any benchmark data for the {gpuName}.
        </div>
      )}
    </section>
  );
}
