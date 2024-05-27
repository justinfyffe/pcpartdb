import { CpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface PowerTableProps {
  cpu: CpuProduct;
  className?: string;
}

export const PowerTable: FunctionComponent<PowerTableProps> = (props) => {
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
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.socket]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.pciExpress]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.tdp]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.pl1]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.pl2]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.ppt]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.tCaseMax]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.tjMax]} />
      </TBody>
    </Table>
  );
};
