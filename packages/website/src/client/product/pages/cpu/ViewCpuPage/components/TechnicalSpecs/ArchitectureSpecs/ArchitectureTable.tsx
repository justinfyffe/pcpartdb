import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

interface ArchitectureTableProps {
  className?: string;
}

export const ArchitectureTable: FunctionComponent<ArchitectureTableProps> = (
  props,
) => {
  const { className } = props;

  const { cpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.architecture]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.codename]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.generation]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.memorySupport]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.memoryChannels]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.hasEccMemory]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.pciExpress]} />
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.chipsets]} />
      </TBody>
    </Table>
  );
};
