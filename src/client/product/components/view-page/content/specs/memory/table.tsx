import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { SpecRow } from '../../../spec-row';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <SpecRow spec="memorySize" />
        <SpecRow spec="memoryType" />
        <SpecRow spec="memoryBandwidth" />
        <SpecRow spec="memoryClock" />
        <SpecRow spec="memoryInterface" />
      </TBody>
    </Table>
  );
};
