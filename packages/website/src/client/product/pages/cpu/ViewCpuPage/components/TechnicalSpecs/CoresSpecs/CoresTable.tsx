import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

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
