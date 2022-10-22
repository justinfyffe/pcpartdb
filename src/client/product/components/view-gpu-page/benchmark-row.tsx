import { Td, Tr } from '@client/shared/components';
import {
  formatProductBenchmark,
  ProductBenchmarkKey,
} from '@shared/product-benchmark';
import React, { useContext } from 'react';
import { ProductContext } from '../product-context';

const LABELS: Record<string, string> = {
  [ProductBenchmarkKey.G2dMark]: 'G2D Mark',
  [ProductBenchmarkKey.G3dMark]: 'G3D Mark',
  [ProductBenchmarkKey.TimeSpyGraphics]: '3DMark Time Spy Graphics',
};

interface BenchmarkRowProps {
  benchmark: ProductBenchmarkKey;
}

export const BenchmarkRow = (props: BenchmarkRowProps) => {
  const { benchmark: key } = props;

  const context = useContext(ProductContext);
  const benchmark = context.benchmarks[key];

  return (
    <Tr>
      <Td className="border-r-0 text-left">
        {benchmark?.source != null ? (
          <a href={benchmark.source}>{LABELS[key]}</a>
        ) : (
          <>{LABELS[key]}</>
        )}
      </Td>
      <Td className="border-l-0 text-right">
        {formatProductBenchmark(benchmark)}
      </Td>
    </Tr>
  );
};
