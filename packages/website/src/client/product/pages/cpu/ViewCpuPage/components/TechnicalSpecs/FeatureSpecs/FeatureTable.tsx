import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

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
      <TBody>
        <ProductFieldRow type={ProductType.Cpu} fields={[cpu.bundledCooler]} />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.integratedGraphics]}
        />
        <ProductFieldRow
          type={ProductType.Cpu}
          fields={[cpu.extensionsTechnologies]}
        />
      </TBody>
    </Table>
  );
};
