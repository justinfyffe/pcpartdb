export * from './intro';
export * from './table';
import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { FieldRow } from '../../field-row';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <FieldRow field="shaderUnitsCudaCores" />
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

  return (
    <Table border responsive className={className}>
      <TBody>
        <FieldRow field="pixelFillRate" />
        <FieldRow field="textureFillRate" />
        <FieldRow field="fp32Performance" />
        <FieldRow field="fp64Performance" />
      </TBody>
    </Table>
  );
};
