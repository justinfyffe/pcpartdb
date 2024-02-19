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

interface CoresTableProps {
  comparison: CpuProductComparison;
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
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
          fields={[cpu1.fields?.cores, cpu2.fields?.cores]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.threads, cpu2.fields?.threads]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.pCores, cpu2.fields?.pCores]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.eCores, cpu2.fields?.eCores]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.clock, cpu2.fields?.clock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.turboClock, cpu2.fields?.turboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.pCoreClock, cpu2.fields?.pCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.pCoreTurboClock, cpu2.fields?.pCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.eCoreClock, cpu2.fields?.eCoreClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.eCoreTurboClock, cpu2.fields?.eCoreTurboClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.baseClock, cpu2.fields?.baseClock]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu1.fields?.multiplier, cpu2.fields?.multiplier]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[
            cpu1.fields?.multiplierUnlocked,
            cpu2.fields?.multiplierUnlocked,
          ]}
        />
      </TBody>
    </Table>
  );
};
