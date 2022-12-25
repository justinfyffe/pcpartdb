import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../../spec-row';

interface ProcessorTableProps {
  className?: string;
}

export const ProcessorTable: FunctionComponent<ProcessorTableProps> = (
  props,
) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <SpecRow spec="gpuName" />
        <SpecRow spec="architecture" />
        <SpecRow spec="processSize" />
        <SpecRow spec="transistors" />
      </TBody>
    </Table>
  );
};
