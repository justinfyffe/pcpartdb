import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { FieldRow } from '../../field-row';

interface MemoryTableProps {
  className?: string;
}

export const MemoryTable: FunctionComponent<MemoryTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <FieldRow field="memorySize" />
        <FieldRow field="memoryType" />
        <FieldRow field="memoryBandwidth" />
        <FieldRow field="memoryClock" />
        <FieldRow field="memoryInterface" />
      </TBody>
    </Table>
  );
};
