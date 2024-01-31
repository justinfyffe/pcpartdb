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
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.generation]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.architecture]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.codename]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.memorySupport]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.memoryChannels]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.eccMemory]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.pciExpress]}
        />
      </TBody>
    </Table>
  );
};
