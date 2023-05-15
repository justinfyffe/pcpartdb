import { getViewGpuPath, Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../../shared/components';
import { formatGpuDimensions, formatGpuField, getGpuName } from '../../../..';
import { ViewPageContext } from '../../context';
import { CustomRow } from '../CustomRow';

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
    <CustomRow highlight={currentRetailModel.id === retailModel.id}>
      <Td>
        <a href={href}>{name}</a>
      </Td>
      <Td className="text-left">{dimensions}</Td>
      <Td className="text-left">{clock}</Td>
      <Td className="text-left">{tdp}</Td>
    </CustomRow>
  );
};
