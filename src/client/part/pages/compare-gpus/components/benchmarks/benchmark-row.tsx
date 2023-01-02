import { Td, Tr } from '@client/shared/components';
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timeSpyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: BenchmarkKey;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ComparePageContext);
  const [part1, part2] = context.comparison;
  const benchmark1 = part1.benchmarks[key];
  const benchmark2 = part2.benchmarks[key];

  return (
    <Tr>
      <Td className="text-left w-[33%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark1?.source != null ? (
          <a href={benchmark1.source}>{formatBenchmark(benchmark1)}</a>
        ) : (
          <>{formatBenchmark(benchmark1) || '--'}</>
        )}
      </Td>
      <Td className="text-left w-[33%]">
        {benchmark2?.source != null ? (
          <a href={benchmark2.source}>{formatBenchmark(benchmark2)}</a>
        ) : (
          <>{formatBenchmark(benchmark2) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
