import React, { FunctionComponent, useContext } from 'react';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from '../../../../../../shared/components';
import { getGpuName } from '../../../../..';
import { ComparePageContext } from '../../../context';
import { FieldRow } from '../../FieldRow/FieldRow';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(gpu1, { company: false })}</Th>
          <Th>{getGpuName(gpu2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <FieldRow field="shaderUnitsCudaCores" />
        <FieldRow field="computeUnitsSmCount" />
        <FieldRow field="textureMappingUnits" />
        <FieldRow field="renderOutputUnits" />
        <FieldRow field="tensorCores" />
        <FieldRow field="rayTracingCores" />
        <FieldRow field="coreClockSpeedBase" />
        <FieldRow field="coreClockSpeedBoost" />
        <FieldRow field="l1Cache" />
        <FieldRow field="l2Cache" />
        <FieldRow field="pixelFillRate" />
        <FieldRow field="textureFillRate" />
        <FieldRow field="fp32Performance" />
        <FieldRow field="fp64Performance" />
      </TBody>
    </Table>
  );
};

interface CoresPerformanceTableProps {
  className?: string;
}

export const CoresPerformanceTable: FunctionComponent<
  CoresPerformanceTableProps
> = (props) => {
  const { className } = props;

  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  return (
    <Table border responsive className={className}>
      <THead>
        <Tr>
          <Th></Th>
          <Th>{getGpuName(gpu1, { company: false })}</Th>
          <Th>{getGpuName(gpu2, { company: false })}</Th>
        </Tr>
      </THead>
      <TBody>
        <FieldRow field="pixelFillRate" />
        <FieldRow field="textureFillRate" />
        <FieldRow field="fp32Performance" />
        <FieldRow field="fp64Performance" />
      </TBody>
    </Table>
  );
};
