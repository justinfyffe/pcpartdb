import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

interface PhysicalTableProps {
  className?: string;
}

export const PhysicalTable: FunctionComponent<PhysicalTableProps> = (props) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.socket]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.foundry]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.processSize]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.transistors]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.tCaseMax]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.tjMax]} />
      </TBody>
    </Table>
  );
};
