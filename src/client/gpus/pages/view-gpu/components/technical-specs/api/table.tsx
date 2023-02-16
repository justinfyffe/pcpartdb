import { Table, TBody } from '@client/shared/components';
import React, { FunctionComponent } from 'react';
import { FieldRow } from '../../field-row';

interface ApiTableProps {
  className?: string;
}

export const ApiTable: FunctionComponent<ApiTableProps> = (props) => {
  const { className } = props;

  return (
    <Table border responsive className={className}>
      <TBody>
        <FieldRow field="directxVersion" />
        <FieldRow field="openClVersion" />
        <FieldRow field="openGlVersion" />
        <FieldRow field="shaderModelVersion" />
      </TBody>
    </Table>
  );
};
