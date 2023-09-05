import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent, useContext } from 'react';
import { Table, TBody } from '../../../../../../../shared/components';
import { ViewPageContext } from '../../../context';

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
