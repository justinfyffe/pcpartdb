import { GpuProduct, ProductType } from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductFieldRow } from 'packages/website/src/app/_common/product/components/ProductFieldRow/ProductFieldRow';
import React, { FunctionComponent } from 'react';

interface TheoreticalPerfTableProps {
  gpu: GpuProduct;
  className?: string;
}

export const TheoreticalPerfTable: FunctionComponent<
  TheoreticalPerfTableProps
> = (props) => {
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
        {/*  */}
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.pixelRate]}
        />
        <ProductFieldRow
          type={ProductType.Gpu}
          fields={[gpu.fields?.textureRate]}
        />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.fp32]} />
        <ProductFieldRow type={ProductType.Gpu} fields={[gpu.fields?.fp64]} />
      </TBody>
    </Table>
  );
};
