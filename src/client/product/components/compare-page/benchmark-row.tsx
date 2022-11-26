import { Td, Tr } from '@client/shared/components';
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import React, { useContext } from 'react';
import { ProductsContext } from './products-context';

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

  const context = useContext(ProductsContext);
  const benchmark1 = context.benchmarks[0][key];
  const benchmark2 = context.benchmarks[1][key];

  return (
    <Tr>
      <Td className="border-r-0 text-left min-w-45">
        <>{LABELS[key]}</>
      </Td>
      <Td className="border-l-0 text-left min-w-20">
        {benchmark1?.source != null ? (
          <a href={benchmark1.source}>{formatBenchmark(benchmark1)}</a>
        ) : (
          <>{formatBenchmark(benchmark1) || '--'}</>
        )}
      </Td>
      <Td className="border-l-0 text-left min-w-20">
        {benchmark2?.source != null ? (
          <a href={benchmark2.source}>{formatBenchmark(benchmark2)}</a>
        ) : (
          <>{formatBenchmark(benchmark2) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
