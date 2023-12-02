import {
  formatGpuDimensions,
  formatProductName,
  getViewGpuPath,
  GpuProduct,
  productFieldFormattedValue,
} from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components/ProductCustomRow/ProductCustomRow';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../context/ViewPageContext';

interface RetailModelsTableProps {
  className?: string;
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, retailModels } = useContext(ViewPageContext);

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
  retailModel: GpuProduct;
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentRetailModel, retailModel } = props;

  const name = useMemo(() => formatProductName(retailModel), [retailModel]);
  const href = useMemo(() => getViewGpuPath(retailModel), [retailModel]);
  const clock = useMemo(
    () =>
      `${productFieldFormattedValue(
        retailModel.fields?.gpuCoreBaseClock,
      )} / ${productFieldFormattedValue(
        retailModel.fields?.gpuCoreBoostClock,
      )}`,
    [
      retailModel.fields?.gpuCoreBaseClock,
      retailModel.fields?.gpuCoreBoostClock,
    ],
  );
  const dimensions = useMemo(
    () => formatGpuDimensions(retailModel),
    [retailModel],
  );
  const tdp = useMemo(
    () => productFieldFormattedValue(retailModel.fields?.tdp),
    [retailModel.fields?.tdp],
  );

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
