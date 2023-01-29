import { formatGpuBenchmark } from '@client/gpus';
import { Td, Tr } from '@client/shared/components';
import { GpuBenchmark, GpuBenchmarkKey } from '@shared/gpus';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: GpuBenchmarkKey;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const benchmark1 = gpu1.benchmarks[key] as GpuBenchmark;
  const benchmark2 = gpu2.benchmarks[key] as GpuBenchmark;

  return (
    <Tr>
      <Td className="text-left w-[33%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark1?.meta?.source != null ? (
          <a href={benchmark1.meta.source}>{formatGpuBenchmark(benchmark1)}</a>
        ) : (
          <>{formatGpuBenchmark(benchmark1) || '--'}</>
        )}
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark2?.meta?.source != null ? (
          <a href={benchmark2.meta.source}>{formatGpuBenchmark(benchmark2)}</a>
        ) : (
          <>{formatGpuBenchmark(benchmark2) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
