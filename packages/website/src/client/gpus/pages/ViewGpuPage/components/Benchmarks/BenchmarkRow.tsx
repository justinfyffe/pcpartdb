import { GpuBenchmarks, GpuField } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import { Td, Tr } from '../../../../../shared/components';
import { formatGpuField } from '../../../../utils';
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

  const label = LABELS[key];
  const value = useMemo(() => formatGpuField(benchmark) || '--', [benchmark]);

  return (
    <Tr>
      <Td className="text-left w-[50%]">{label}</Td>
      <Td className="text-left w-[50%]">{value}</Td>
    </Tr>
  );
};
