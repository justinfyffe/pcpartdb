import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import { ProductCustomRow } from 'packages/website/src/client/product/components';
import {
  formatGpuDimensions,
  formatGpuField,
  formatGpuName,
} from 'packages/website/src/client/product/utils';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { ViewPageContext } from '../../context';

interface RetailModelsTableProps {
  className?: string;
}

export const RetailModelsTable: FunctionComponent<RetailModelsTableProps> = (
  props,
) => {
  const { className } = props;
  const { gpu, contentData } = useContext(ViewPageContext);
  const { retailModels } = contentData;

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
  currentRetailModel: Gpu;
  retailModel: Gpu;
}

const RetailModelsTableRow: FunctionComponent<RetailModelsTableRowProps> = (
  props,
) => {
  const { currentRetailModel, retailModel } = props;

  const name = useMemo(() => formatGpuName(retailModel), [retailModel]);
  const href = useMemo(() => getViewGpuPath(retailModel), [retailModel]);
  const clock = useMemo(
    () =>
      `${formatGpuField(retailModel.coreClockSpeedBase)} / ${formatGpuField(
        retailModel.coreClockSpeedBoost,
      )}`,
    [retailModel.coreClockSpeedBase, retailModel.coreClockSpeedBoost],
  );
  const dimensions = useMemo(
    () => formatGpuDimensions(retailModel),
    [retailModel],
  );
  const tdp = useMemo(
    () => formatGpuField(retailModel.thermalDesignPower),
    [retailModel.thermalDesignPower],
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
