import { formatGpuField } from '@client/gpus/gpu-utils';
import { Td, Tr } from '@client/shared/components';
import { GpuBenchmarks, GpuField } from '@shared/gpus';
import React, { useContext } from 'react';
import { ViewPageContext } from '../../context';

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

  const { gpu } = useContext(ViewPageContext);
  const benchmark = gpu.benchmarks[key] as GpuField;

  return (
    <Tr>
      <Td className="text-left w-[50%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[50%]">
        {benchmark?.meta?.source != null ? (
          <a href={benchmark.meta.source}>{formatGpuField(benchmark)}</a>
        ) : (
          <>{formatGpuField(benchmark) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
