import { Gpu, GpuField } from '@pcpartdb/shared';
import React, { useContext, useMemo } from 'react';
import { Td, Tr } from '../../../../../shared/components';
import { formatGpuField } from '../../../..';
import { ComparePageContext } from '../../context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timespyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: keyof Gpu;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ComparePageContext);
  const [gpu1, gpu2] = context.comparison;
  const benchmark1 =
    (gpu1.chipset?.[key] as GpuField) || (gpu1[key] as GpuField);
  const benchmark2 =
    (gpu2.chipset?.[key] as GpuField) || (gpu2[key] as GpuField);

  const label = LABELS[key];
  const value1 = useMemo(
    () => formatGpuField(benchmark1) || '--',
    [benchmark1],
  );
  const value2 = useMemo(
    () => formatGpuField(benchmark2) || '--',
    [benchmark2],
  );

  return (
    <Tr>
      <Td className="text-left w-[33%]">
        <>{label}*</>
      </Td>
      <Td className="text-left w-[33%]">{value1}</Td>
      <Td className="text-left w-[33%]">{value2}</Td>
    </Tr>
  );
};
