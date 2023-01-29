import { formatGpuBenchmark } from '@client/gpus/gpu-benchmark-utils';
import { Td, Tr } from '@client/shared/components';
import { GpuBenchmark, GpuBenchmarkKey } from '@shared/gpus';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timeSpyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: GpuBenchmarkKey;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const { gpu } = useContext(ViewPageContext);
  const benchmark = gpu.benchmarks[key] as GpuBenchmark;

  return (
    <Tr>
      <Td className="text-left w-[50%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[50%]">
        {benchmark?.meta?.source != null ? (
          <a href={benchmark.meta.source}>{formatGpuBenchmark(benchmark)}</a>
        ) : (
          <>{formatGpuBenchmark(benchmark) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
