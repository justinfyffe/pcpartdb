import { ProductType } from '@pcpartdb/shared';
import { ProductFieldRow } from 'packages/website/src/client/product/components/ProductFieldRow/ProductFieldRow';
import {
  Table,
  TBody,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContext';

interface CompatibilityTableProps {
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu } = useContext(ViewPageContext);

  return (
    <Table border responsive className={className}>
      <TBody>
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.slotWidth]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.length]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.width]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.height]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.weight]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.busInterface]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.thermalDesignPower]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.suggestedPsu]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.powerConnectors]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.outputs]} />
      </TBody>
    </Table>
  );
};
