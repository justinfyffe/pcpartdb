import { BenchmarKey, getProductBenchmark } from '@pcpartdb/shared';
import { ProductBenchmarkRow } from 'packages/website/src/client/product/components/ProductBenchmarkRow/ProductBenchmarkRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface BenchmarksTableProps {
  className?: string;
}

export const BenchmarksTable: FunctionComponent<BenchmarksTableProps> = (
  props,
) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Benchmark</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu, BenchmarKey.CpuMarkMultiThread),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu, BenchmarKey.CpuMarkSingleThread),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu, BenchmarKey.GeekBenchMultiCore),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(cpu, BenchmarKey.GeekBenchSingleCore),
          ]}
        />
      </TBody>
    </Table>
  );
};
