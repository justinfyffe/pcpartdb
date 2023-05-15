import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components';
import React, { FunctionComponent, useMemo } from 'react';
import {
  formatGpuDimensions,
  formatGpuField,
  getGpuName,
} from '../../../../utils';

interface RetailModelsTableProps {
  retailModels: Gpu[];
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
  retailModel: Gpu;
}

export const RetailModelRow: FunctionComponent<RetailModelRowProps> = (
  props,
) => {
  const { retailModel } = props;

  const name = useMemo(() => getGpuName(retailModel), [retailModel]);
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
