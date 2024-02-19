import { GpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface MemoryTableProps {
  gpu: GpuProduct;
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
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
          fields={[gpu.fields?.memorySize]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.memoryType]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.memoryBandwidth]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.memoryClock]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.memoryInterface]}
        />
      </TBody>
    </Table>
  );
};
