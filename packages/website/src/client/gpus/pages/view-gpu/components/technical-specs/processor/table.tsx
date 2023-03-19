import React, { FunctionComponent } from 'react';
import { Table, TBody } from '../../../../../../shared/components';
import { FieldRow } from '../../field-row';

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
        <FieldRow field="codename" />
        <FieldRow field="architecture" />
        <FieldRow field="processSize" />
        <FieldRow field="transistors" />
      </TBody>
    </Table>
  );
};
