import { CpuProduct, formatCompanyName, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductCustomRow } from 'packages/website/src/app/_common/product/components/ProductCustomRow/ProductCustomRow';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface PhysicalTableProps {
  cpu: CpuProduct;
  className?: string;
}

export const PhysicalTable: FunctionComponent<PhysicalTableProps> = (props) => {
  const { cpu, className } = props;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductCustomRow
          label="Manufacturer"
          values={[formatCompanyName(cpu.company) ?? '--']}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.foundry]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.processSize]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.transistors]}
        />
      </TBody>
    </Table>
  );
};
