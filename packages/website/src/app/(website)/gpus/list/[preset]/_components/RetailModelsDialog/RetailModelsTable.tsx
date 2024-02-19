import {
  formatGpuDimensions,
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import React, { FunctionComponent } from 'react';

interface RetailModelsTableProps {
  retailModels: GpuProduct[];
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { retailModels } = props;

  return (
    <div className="bg-white flex flex-col overflow-auto">
      <Table responsive border>
        <THead>
          <Tr>
            <Th className="md:border-r-px">Product</Th>
            <Th className="text-right md:hidden">Dimensions</Th>
            <Th className="text-right md:hidden">Clock</Th>
            <Th className="text-right md:hidden">TDP</Th>
          </Tr>
        </THead>
        <TBody>
          {retailModels.map((retailModel) => (
            <RetailModelRow key={retailModel.id} retailModel={retailModel} />
          ))}
        </TBody>
      </Table>
    </div>
  );
};

interface RetailModelRowProps {
  retailModel: GpuProduct;
}

export const RetailModelRow: FunctionComponent<RetailModelRowProps> = (
  props,
) => {
  const { retailModel } = props;

  const name = formatProductName(retailModel);
  const href = getViewGpuPath(retailModel);

  const clock = `${
    productFieldFormattedValue(retailModel.fields.gpuCoreBaseClock) ?? '--'
  } / ${
    productFieldFormattedValue(retailModel.fields.gpuCoreBoostClock) ?? '--'
  }`;
  const dimensions = formatGpuDimensions(retailModel) ?? '--';
  const tdp = productFieldFormattedValue(retailModel.fields.tdp) ?? '--';

  return (
    <Tr>
      <Td className="md:border-r-px">
        <a href={href}>{name}</a>
      </Td>
      <Td className="text-right md:hidden">{dimensions}</Td>
      <Td className="text-right md:hidden">{clock}</Td>
      <Td className="text-right md:hidden">{tdp}</Td>
    </Tr>
  );
};
