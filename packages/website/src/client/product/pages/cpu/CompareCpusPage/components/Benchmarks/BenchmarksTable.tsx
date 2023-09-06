import { formatCpuName, ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
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
      formatCpuName(cpu1, { company: false }),
      formatCpuName(cpu2, { company: false }),
    ];
  }, [cpu1, cpu2]);

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
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.cpuMarkMultiThread, cpu2.cpuMarkMultiThread]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.cpuMarkSingleThread, cpu2.cpuMarkSingleThread]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.geekbenchMultiCore, cpu2.geekbenchMultiCore]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.geekbenchSingleCore, cpu2.geekbenchSingleCore]}
        />
      </TBody>
    </Table>
  );
};
