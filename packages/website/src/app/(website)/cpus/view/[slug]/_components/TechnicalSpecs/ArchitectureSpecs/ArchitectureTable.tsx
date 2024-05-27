import { CpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface ArchitectureTableProps {
  cpu: CpuProduct;
  className?: string;
}

export const ArchitectureTable: FunctionComponent<ArchitectureTableProps> = (
  props,
) => {
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
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.generation]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.architecture]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.codename]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.memorySupport]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.memoryChannels]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eccMemory]}
        />
      </TBody>
    </Table>
  );
};
