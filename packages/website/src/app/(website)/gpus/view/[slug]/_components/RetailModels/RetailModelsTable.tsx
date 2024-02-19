import {
  formatGpuDimensions,
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { ProductCustomRow } from 'packages/website/src/app/_common/product/components/ProductCustomRow/ProductCustomRow';
import React, { FunctionComponent } from 'react';

interface RetailModelsTableProps {
  gpu: GpuProduct;
  retailModels: Partial<GpuProduct>[];
  className?: string;
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { gpu, retailModels, className } = props;

  const currentRetailModel = gpu;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th>Product</Th>
          <Th className="text-left">Dimensions</Th>
          <Th className="text-left">Clock</Th>
          <Th className="text-left">TDP</Th>
        </Tr>
      </THead>
      <TBody>
        {retailModels.map((retailModel) => (
          <RetailModelsTableRow
            key={retailModel.id}
            currentRetailModel={currentRetailModel}
            retailModel={retailModel}
          />
        ))}
      </TBody>
    </Table>
  );
};

interface RetailModelsTableRowProps {
  currentRetailModel: GpuProduct;
  retailModel: Partial<GpuProduct>;
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentRetailModel, retailModel } = props;

  const name = formatProductName(retailModel);
  const href = getViewGpuPath(retailModel);

  const clock = `${productFieldFormattedValue(
    retailModel.fields?.gpuCoreBaseClock,
  )} / ${productFieldFormattedValue(retailModel.fields?.gpuCoreBoostClock)}`;

  const dimensions = formatGpuDimensions(retailModel);
  const tdp = productFieldFormattedValue(retailModel.fields?.tdp);

  return (
    <ProductCustomRow
      highlight={
        currentRetailModel.id === retailModel.id ? 'primary' : undefined
      }
      label={<a href={href}>{name}</a>}
      values={[dimensions, clock, tdp]}
    />
  );
};
