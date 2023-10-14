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
      <THead>
        <Tr>
          <Th>Spec</Th>
          <Th>Value</Th>
        </Tr>
      </THead>
      <TBody>
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.slotWidth]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.length]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.width]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.height]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.weight]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.busInterface]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.tdp]} />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.suggestedPsu]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.powerConnectors]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.outputs]}
        />
      </TBody>
    </Table>
  );
};
