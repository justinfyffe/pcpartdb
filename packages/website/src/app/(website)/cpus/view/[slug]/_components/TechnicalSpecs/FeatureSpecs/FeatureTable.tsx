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

export const FeatureTable: FunctionComponent<ArchitectureTableProps> = (
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
          fields={[cpu.fields?.bundledCooler]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.integratedGraphics]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.extensionsTechnologies]}
        />
      </TBody>
    </Table>
  );
};
