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

interface ArchitectureTableProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const FeatureTable: FunctionComponent<ArchitectureTableProps> = (
  props,
) => {
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
          fields={[cpu1.fields?.bundledCooler, cpu2.fields?.bundledCooler]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.integratedGraphics,
            cpu2.fields?.integratedGraphics,
          ]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.extensionsTechnologies,
            cpu2.fields?.extensionsTechnologies,
          ]}
        />
      </TBody>
    </Table>
  );
};
