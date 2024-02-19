import {
  CpuProductComparison,
  formatProductName,
  ProductType,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface PhysicalTableProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const PhysicalTable: FunctionComponent<PhysicalTableProps> = (props) => {
  const { comparison, className } = props;
  const [cpu1, cpu2] = comparison;

  const [name1, name2] = [
    formatProductName(cpu1, { company: false }),
    formatProductName(cpu2, { company: false }),
  ];

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>{name1}</Th>
          <Th>{name2}</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.socket, cpu2.fields?.socket]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.foundry, cpu2.fields?.foundry]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.processSize, cpu2.fields?.processSize]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.transistors, cpu2.fields?.transistors]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.tCaseMax, cpu2.fields?.tCaseMax]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.tjMax, cpu2.fields?.tjMax]}
        />
      </TBody>
    </Table>
  );
};
