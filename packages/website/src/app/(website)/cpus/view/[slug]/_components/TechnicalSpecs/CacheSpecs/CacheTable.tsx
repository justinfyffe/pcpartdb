import { CpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface CacheTableProps {
  cpu: CpuProduct;
  className?: string;
}

export const CacheTable: FunctionComponent<CacheTableProps> = (props) => {
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
          fields={[cpu.fields?.l1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.l2Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.l3Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eCoreL1Cache]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eCoreL2Cache]}
        />
      </TBody>
    </Table>
  );
};
