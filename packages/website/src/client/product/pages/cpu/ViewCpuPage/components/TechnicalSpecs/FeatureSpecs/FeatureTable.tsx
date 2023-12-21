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

export const FeatureTable: FunctionComponent<ArchitectureTableProps> = (
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
          fields={[cpu.fields?.bundledCooler]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.integratedGraphics]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.fields?.extensionsTechnologies]}
        />
      </TBody>
    </Table>
  );
};
