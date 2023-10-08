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
  const [gpu1, gpu2] = comparison;

  const [name1, name2] = useMemo(() => {
    return [
      formatProductName(gpu1, { company: false }),
      formatProductName(gpu2, { company: false }),
    ];
  }, [gpu1, gpu2]);

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(gpu1, BenchmarKey.G3dMark),
            getProductBenchmark(gpu2, BenchmarKey.G3dMark),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(gpu1, BenchmarKey.G2dMark),
            getProductBenchmark(gpu2, BenchmarKey.G2dMark),
          ]}
        />
        <ProductBenchmarkRow
          benchmarks={[
            getProductBenchmark(gpu1, BenchmarKey.TimespyGraphics),
            getProductBenchmark(gpu2, BenchmarKey.TimespyGraphics),
          ]}
        />
      </TBody>
    </Table>
  );
};
