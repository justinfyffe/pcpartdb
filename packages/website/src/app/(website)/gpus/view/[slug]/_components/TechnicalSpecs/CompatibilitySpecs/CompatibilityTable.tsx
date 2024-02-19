import { GpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface CompatibilityTableProps {
  gpu: GpuProduct;
  className?: string;
}

export const CompatibilityTable: FunctionComponent<CompatibilityTableProps> = (
  props,
) => {
  const { gpu, className } = props;

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
