import { CpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface CoresTableProps {
  cpu: CpuProduct;
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
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
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.cores]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.threads]}
        />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.pCores]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.eCores]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.clock]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.turboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.pCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.pCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.baseClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.multiplier]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.multiplierUnlocked]}
        />
      </TBody>
    </Table>
  );
};
