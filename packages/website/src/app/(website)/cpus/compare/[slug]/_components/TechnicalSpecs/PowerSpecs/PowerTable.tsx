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

interface PowerTableProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const PowerTable: FunctionComponent<PowerTableProps> = (props) => {
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
          fields={[cpu1.fields?.tdp, cpu2.fields?.tdp]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.pl1, cpu2.fields?.pl1]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.pl2, cpu2.fields?.pl2]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.ppt, cpu2.fields?.ppt]}
        />
      </TBody>
    </Table>
  );
};
