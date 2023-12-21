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

interface PowerTableProps {
  className?: string;
}

export const PowerTable: FunctionComponent<PowerTableProps> = (props) => {
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
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.tdp]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.pl1]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.pl2]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.fields?.ppt]} />
      </TBody>
    </Table>
  );
};
