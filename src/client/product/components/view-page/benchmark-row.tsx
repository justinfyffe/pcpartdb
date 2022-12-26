import { Td, Tr } from '@client/shared/components';
import { Benchmarks, formatBenchmark } from '@shared/benchmark';
import React, { useContext } from 'react';
import { ViewPageContext } from './context';

const LABELS: Record<string, string> = {
  g2dMark: 'G2D Mark',
  g3dMark: 'G3D Mark',
  timeSpyGraphics: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: keyof Benchmarks;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const { product } = useContext(ViewPageContext);
  const benchmark = product.benchmarks[key];

  return (
    <Tr>
      <Td className="text-left w-[50%]">
        <>{LABELS[key]}</>
      </Td>
      <Td className="text-left w-[50%]">
        {benchmark?.source != null ? (
          <a href={benchmark.source}>{formatBenchmark(benchmark)}</a>
        ) : (
          <>{formatBenchmark(benchmark) || '--'}</>
        )}
      </Td>
    </Tr>
  );
};
