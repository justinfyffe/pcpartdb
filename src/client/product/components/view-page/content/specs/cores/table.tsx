export * from './intro';
export * from './table';
import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../../spec-row';

interface CoresTableProps {
  className?: string;
}

export const CoresTable: FunctionComponent<CoresTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <SpecRow spec="shaderUnitsCudaCores" />
        <SpecRow spec="textureMappingUnits" />
        <SpecRow spec="renderOutputUnits" />
        <SpecRow spec="tensorCores" />
        <SpecRow spec="rayTracingCores" />
        <SpecRow spec="coreClockSpeedBase" />
        <SpecRow spec="coreClockSpeedBoost" />
        <SpecRow spec="l1Cache" />
        <SpecRow spec="l2Cache" />
      </TBody>
    </Table>
  );
};
