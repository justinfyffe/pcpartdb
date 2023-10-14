import {
  BenchmarKey,
  formatProductName,
  getProductBenchmark,
} from '@pcpartdb/shared';
import { ProductBenchmarkRow } from 'packages/website/src/client/product/components/ProductBenchmarkRow/ProductBenchmarkRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(cpu1, { company: false }),
      formatProductName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Benchmark</Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu1, BenchmarKey.CpuMarkMultiThread),
            getProductBenchmark(cpu2, BenchmarKey.CpuMarkMultiThread),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu1, BenchmarKey.CpuMarkSingleThread),
            getProductBenchmark(cpu2, BenchmarKey.CpuMarkSingleThread),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu1, BenchmarKey.GeekBenchMultiCore),
            getProductBenchmark(cpu2, BenchmarKey.GeekBenchMultiCore),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu1, BenchmarKey.GeekBenchSingleCore),
            getProductBenchmark(cpu2, BenchmarKey.GeekBenchSingleCore),
          ]}
        />
      </TBody>
    </Table>
  );
};
