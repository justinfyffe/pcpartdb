import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

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
