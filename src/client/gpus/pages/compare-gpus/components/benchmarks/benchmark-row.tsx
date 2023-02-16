import { formatGpuField } from '@client/gpus/gpu-utils';
import { Td, Tr } from '@client/shared/components';
import { GpuBenchmarks, GpuField } from '@shared/gpus';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: keyof GpuBenchmarks;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const benchmark1 = gpu1.benchmarks[key] as GpuField;
  const benchmark2 = gpu2.benchmarks[key] as GpuField;

  return (
    <Tr>
      <Td className="text-left w-[33%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark1?.meta?.source != null ? (
          <a href={benchmark1.meta.source}>{formatGpuField(benchmark1)}</a>
        ) : (
          <>{formatGpuField(benchmark1) || '--'}</>
        )}
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark2?.meta?.source != null ? (
          <a href={benchmark2.meta.source}>{formatGpuField(benchmark2)}</a>
        ) : (
          <>{formatGpuField(benchmark2) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
