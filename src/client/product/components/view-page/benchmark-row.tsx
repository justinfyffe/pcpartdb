import { Td, Tr } from '@client/shared/components';
import { BenchmarkKey, formatBenchmark } from '@shared/benchmark';
import React, { useContext } from 'react';
import { ProductContext } from './product-context';

const LABELS: Record<string, string> = {
  [BenchmarkKey.G2dMark]: 'G2D Mark',
  [BenchmarkKey.G3dMark]: 'G3D Mark',
  [BenchmarkKey.TimeSpyGraphics]: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: BenchmarkKey;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ProductContext);
  const benchmark = context.benchmarks[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">
        <>{LABELS[key]}</>
      </Td>
      <Td className="border-l-0 text-right">
        {benchmark?.source != null ? (
          <a href={benchmark.source}>{formatBenchmark(benchmark)}</a>
        ) : (
          <>{formatBenchmark(benchmark)}</>
        )}
      </Td>
    </Tr>
  );
};
